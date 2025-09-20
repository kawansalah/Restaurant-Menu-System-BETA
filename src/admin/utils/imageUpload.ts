import supabase from "@/lib/supabase";

// Image optimization and resizing utility
export const resizeImage = (
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          }
        },
        "image/jpeg",
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

// Logo-specific resize function that preserves transparency
export const resizeLogoImage = (
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.9
): Promise<Blob> => {
  return new Promise((resolve) => {
    // For SVG files, return the original file without processing
    if (file.type === 'image/svg+xml') {
      resolve(file);
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Clear canvas with transparent background
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        // Draw image preserving transparency
        ctx.drawImage(img, 0, 0, width, height);
      }

      // Use PNG format to preserve transparency
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          }
        },
        "image/png",
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

// Upload image to Supabase storage
export const uploadImageToSupabase = async (
  file: File,
  folder: string = "subcategories"
): Promise<{
  originalUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}> => {
  try {
    // Validate file type - only support SVG, PNG, JPG
    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return { error: "Please select a valid image file (SVG, PNG, or JPG only)" };
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { error: "Image size must be less than 10MB" };
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}`;

    // Create original size image (max 1920x1080)
    const originalBlob = await resizeImage(file, 1920, 1080, 0.9);
    const originalPath = `${folder}/original/${fileName}.${fileExt}`;

    // Create thumbnail (max 400x400)
    const thumbnailBlob = await resizeImage(file, 400, 400, 0.8);
    const thumbnailPath = `${folder}/thumbnails/${fileName}.${fileExt}`;

    // Upload original image
    const { error: originalError } = await supabase.storage
      .from("restaurant")
      .upload(originalPath, originalBlob, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (originalError) {
      return {
        error: `Failed to upload original image: ${originalError.message}`,
      };
    }

    // Upload thumbnail
    const { error: thumbnailError } = await supabase.storage
      .from("restaurant")
      .upload(thumbnailPath, thumbnailBlob, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (thumbnailError) {
      // If thumbnail upload fails, clean up original
      await supabase.storage.from("restaurant").remove([originalPath]);
      return { error: `Failed to upload thumbnail: ${thumbnailError.message}` };
    }

    // Get public URLs (or signed URLs if bucket is private)
    const { data: originalData } = supabase.storage
      .from("restaurant")
      .getPublicUrl(originalPath);

    const { data: thumbnailData } = supabase.storage
      .from("restaurant")
      .getPublicUrl(thumbnailPath);

    return {
      originalUrl: originalData.publicUrl,
      thumbnailUrl: thumbnailData.publicUrl,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
};

// Delete image from Supabase storage
export const deleteImageFromSupabase = async (
  imageUrl: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!imageUrl) return { success: true };

    // Extract path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split("/");
    const bucketIndex = pathParts.findIndex((part) => part === "restaurant");

    if (bucketIndex === -1) {
      return { success: false, error: "Invalid image URL format" };
    }

    const imagePath = pathParts.slice(bucketIndex + 1).join("/");
    
    // Create thumbnail path by replacing 'original' directory with 'thumbnails'
    const pathSegments = imagePath.split("/");
    const thumbnailPath = pathSegments.map(segment => 
      segment === "original" ? "thumbnails" : segment
    ).join("/");

    // Delete both original and thumbnail from storage
    const filesToDelete = [imagePath];
    if (thumbnailPath !== imagePath) {
      filesToDelete.push(thumbnailPath);
    }

    const { error } = await supabase.storage
      .from("restaurant")
      .remove(filesToDelete);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    };
  }
};

// Replace image (delete old and upload new)
export const replaceImageInSupabase = async (
  file: File,
  oldImageUrl?: string,
  oldThumbnailUrl?: string,
  folder: string = "subcategories"
): Promise<{ originalUrl?: string; thumbnailUrl?: string; error?: string }> => {
  try {
    // Delete old images first if they exist
    if (oldImageUrl) {
      const deleteResult = await deleteImageFromSupabase(oldImageUrl);
      if (!deleteResult.success) {
        console.warn("Failed to delete old image:", deleteResult.error);
        // Continue with upload even if delete fails
      }
    }

    if (oldThumbnailUrl) {
      const deleteResult = await deleteImageFromSupabase(oldThumbnailUrl);
      if (!deleteResult.success) {
        console.warn("Failed to delete old thumbnail:", deleteResult.error);
        // Continue with upload even if delete fails
      }
    }

    // Upload new image
    const uploadResult = await uploadImageToSupabase(file, folder);

    if (uploadResult.error) {
      return { error: uploadResult.error };
    }

    return {
      originalUrl: uploadResult.originalUrl,
      thumbnailUrl: uploadResult.thumbnailUrl,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Replace failed",
    };
  }
};

// Update image URLs in subcategory
export const updateSubCategoryImages = async (
  subcategoryId: string,
  originalUrl: string,
  thumbnailUrl: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from("subcategories")
      .update({
        image_url: originalUrl,
        thumbnail_url: thumbnailUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subcategoryId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Update failed",
    };
  }
};

// Upload logo image to Supabase (original only, no thumbnail)
export const uploadLogoToSupabase = async (
  file: File,
  folder: string = "system/logos",
  logoType?: 'light' | 'dark'
): Promise<{
  originalUrl?: string;
  error?: string;
}> => {
  try {
    // Validate file type - only support SVG, PNG, JPG
    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return { error: "Please select a valid image file (SVG, PNG, or JPG only)" };
    }

    // Validate file size (max 5MB for logos)
    if (file.size > 5 * 1024 * 1024) {
      return { error: "Logo size must be less than 5MB" };
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}`;

    // Create optimized logo (max 800x400 for logos) - preserve transparency
    const logoBlob = await resizeLogoImage(file, 800, 400, 0.9);
    
    // Organize logos by type in separate folders
    const logoSubfolder = logoType ? `${folder}/${logoType}` : folder;
    const logoPath = `${logoSubfolder}/${fileName}.${fileExt}`;

    // Upload logo to Supabase Storage
     const { error: logoError } = await supabase.storage
       .from("restaurant")
       .upload(logoPath, logoBlob, {
         contentType: file.type,
         upsert: false
       });

     if (logoError) {
       console.error("Error uploading logo:", logoError);
       return { error: `Failed to upload logo: ${logoError.message}` };
     }

     // Get public URL for logo
     const { data: logoUrlData } = supabase.storage
       .from("restaurant")
       .getPublicUrl(logoPath);

    return {
      originalUrl: logoUrlData.publicUrl,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to upload logo",
    };
  }
};
