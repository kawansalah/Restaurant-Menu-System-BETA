import bcrypt from "bcryptjs";
import supabase from "@/lib/supabase";
import { AdminUser, AdminRole } from "@/admin/types/admin";

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Verify a password against a hash
 */
export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

/**
 * Create a new admin user with Supabase Auth integration
 */
export const createAdminUser = async (userData: {
  restaurant_id?: string;
  username: string;
  email: string;
  password: string;
  full_name: string;
  role: AdminRole;
}): Promise<{ success: boolean; user?: AdminUser; error?: string }> => {
  try {
    // Check if username already exists in admin_users table
    const { data: existingUsername } = await supabase
      .from("admin_users")
      .select("id")
      .eq("username", userData.username)
      .single();

    if (existingUsername) {
      return { success: false, error: "Username already exists" };
    }

    // Step 1: Create user in Supabase Auth with proper metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.full_name,
          role: userData.role,
          username: userData.username,
          is_active: true, // Add this to metadata
        },
      },
    });

    if (authError) {
      return { success: false, error: `Auth error: ${authError.message}` };
    }

    if (!authData.user) {
      return { success: false, error: "Failed to create auth user" };
    }

    // Step 2: Hash the password for storage in admin_users table
    const passwordHash = await hashPassword(userData.password);

    // Step 3: Create admin profile in admin_users table
    const { data: newUser, error: profileError } = await supabase
      .from("admin_users")
      .insert({
        id: authData.user.id,
        restaurant_id: userData.restaurant_id || '00000000-0000-0000-0000-000000000001', // Default to main restaurant
        username: userData.username,
        email: userData.email,
        password_hash: passwordHash, // Store hashed password
        full_name: userData.full_name,
        role: userData.role,
        is_active: true,
      })
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

    if (profileError) {
      // If profile creation fails, clean up the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      return {
        success: false,
        error: `Profile creation error: ${profileError.message}`,
      };
    }

    return { success: true, user: newUser };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Update admin user password
 */
export const updateAdminPassword = async (
  userId: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const passwordHash = await hashPassword(newPassword);

    const { error } = await supabase
      .from("admin_users")
      .update({ password_hash: passwordHash })
      .eq("id", userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Deactivate all sessions for a user (useful for forced logout)
 */
export const deactivateUserSessions = async (userId: string): Promise<void> => {
  await supabase
    .from("admin_sessions")
    .update({ is_active: false })
    .eq("admin_user_id", userId);
};

/**
 * Clean up expired sessions (should be run periodically)
 */
export const cleanupExpiredSessions = async (): Promise<void> => {
  await supabase
    .from("admin_sessions")
    .update({ is_active: false })
    .lt("expires_at", new Date().toISOString());
};
