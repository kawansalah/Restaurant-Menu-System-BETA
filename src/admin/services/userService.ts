import supabase from "@/lib/supabase";
import { AdminUser, AdminRole } from "@/admin/types/admin";
import { createAdminUser } from "@/admin/utils/adminAuth";

export interface UserFilters {
  role?: AdminRole;
  is_active?: boolean;
  search?: string;
}

export interface UserUpdateData {
  restaurant_id?: string;
  username?: string;
  email?: string;
  full_name?: string;
  role?: AdminRole;
  is_active?: boolean;
}

/**
 * Fetch all admin users with optional filtering
 */
export const fetchUsers = async (
  filters?: UserFilters
): Promise<{
  data: AdminUser[];
  error?: string;
}> => {
  try {
    let query = supabase
      .from("admin_users")
      .select(
        `
        id,
        restaurant_id,
        username,
        email,
        full_name,
        role,
        is_active,
        last_login,
        created_at,
        updated_at,
        restaurant:restaurants!restaurant_id(
          id,
          name,
          description,
          address,
          phone,
          email,
          website,
          logo_url,
          theme_color,
          is_active,
          created_at,
          updated_at
        )
      `
      )
      .order("created_at", { ascending: false });

    // Apply filters
    if (filters?.role) {
      query = query.eq("role", filters.role);
    }

    if (filters?.is_active !== undefined) {
      query = query.eq("is_active", filters.is_active);
    }

    if (filters?.search) {
      query = query.or(`
        full_name.ilike.%${filters.search}%,
        username.ilike.%${filters.search}%,
        email.ilike.%${filters.search}%
      `);
    }

    const { data, error } = await query;

    if (error) {
      return { data: [], error: error.message };
    }

    const normalized = (data || []).map((u: any) => ({
      ...u,
      restaurant: Array.isArray(u.restaurant) ? u.restaurant[0] : u.restaurant,
    }));
    return { data: normalized as AdminUser[] };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Get a single user by ID
 */
export const fetchUserById = async (
  id: string
): Promise<{
  data: AdminUser | null;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select(
        `
        id,
        restaurant_id,
        username,
        email,
        full_name,
        role,
        is_active,
        last_login,
        created_at,
        updated_at
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Update an admin user
 */
export const updateUser = async (
  id: string,
  updateData: UserUpdateData
): Promise<{
  data: AdminUser | null;
  error?: string;
}> => {
  try {
    // Update the admin_users table
    const { data, error } = await supabase
      .from("admin_users")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        `
        id,
        restaurant_id,
        username,
        email,
        full_name,
        role,
        is_active,
        last_login,
        created_at,
        updated_at
      `
      )
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    // If email is being updated, also update Supabase Auth
    if (updateData.email) {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        id,
        { email: updateData.email }
      );

      if (authError) {
        console.warn("Failed to update auth email:", authError.message);
      }
    }

    return { data };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Delete an admin user
 */
export const deleteUser = async (
  id: string
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // First, delete from admin_users table
    const { error: dbError } = await supabase
      .from("admin_users")
      .delete()
      .eq("id", id);

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    // Then delete from Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(id);

    if (authError) {
      console.warn("Failed to delete auth user:", authError.message);
      // Don't fail the operation if auth deletion fails
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Toggle user active status
 */
export const toggleUserStatus = async (
  id: string
): Promise<{
  data: AdminUser | null;
  error?: string;
}> => {
  try {
    // First get current status
    const { data: currentUser, error: fetchError } = await fetchUserById(id);

    if (fetchError || !currentUser) {
      return { data: null, error: fetchError || "User not found" };
    }

    // Toggle the status
    const newStatus = !currentUser.is_active;

    const { data, error } = await supabase
      .from("admin_users")
      .update({
        is_active: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        `
        id,
        restaurant_id,
        username,
        email,
        full_name,
        role,
        is_active,
        last_login,
        created_at,
        updated_at
      `
      )
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Bulk update users (for batch operations)
 */
export const bulkUpdateUsers = async (
  userIds: string[],
  updateData: UserUpdateData
): Promise<{
  data: AdminUser[];
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .in("id", userIds).select(`
        id,
        restaurant_id,
        username,
        email,
        full_name,
        role,
        is_active,
        last_login,
        created_at,
        updated_at
      `);

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: data || [] };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Bulk delete users
 */
export const bulkDeleteUsers = async (
  userIds: string[]
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // Delete from admin_users table
    const { error: dbError } = await supabase
      .from("admin_users")
      .delete()
      .in("id", userIds);

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    // Delete from Supabase Auth (best effort)
    for (const id of userIds) {
      try {
        await supabase.auth.admin.deleteUser(id);
      } catch (authError) {
        console.warn(`Failed to delete auth user ${id}:`, authError);
      }
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Get user statistics
 */
export const getUserStats = async (): Promise<{
  data: {
    total: number;
    active: number;
    inactive: number;
    byRole: Record<AdminRole, number>;
  };
  error?: string;
}> => {
  try {
    const { data: users, error } = await supabase
      .from("admin_users")
      .select("role, is_active");

    if (error) {
      return {
        data: {
          total: 0,
          active: 0,
          inactive: 0,
          byRole: { super_admin: 0, admin: 0, manager: 0, staff: 0 },
        },
        error: error.message,
      };
    }

    const stats = {
      total: users.length,
      active: users.filter((u) => u.is_active).length,
      inactive: users.filter((u) => !u.is_active).length,
      byRole: {
        super_admin: users.filter((u) => u.role === "super_admin").length,
        admin: users.filter((u) => u.role === "admin").length,
        manager: users.filter((u) => u.role === "manager").length,
        staff: users.filter((u) => u.role === "staff").length,
      } as Record<AdminRole, number>,
    };

    return { data: stats };
  } catch (error) {
    return {
      data: {
        total: 0,
        active: 0,
        inactive: 0,
        byRole: { super_admin: 0, admin: 0, manager: 0, staff: 0 },
      },
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Update user's last login timestamp
 */
export const updateLastLogin = async (
  userId: string
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const { error } = await supabase
      .from("admin_users")
      .update({
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Create a new admin user (wrapper around existing function)
 */
export const createUser = createAdminUser;
