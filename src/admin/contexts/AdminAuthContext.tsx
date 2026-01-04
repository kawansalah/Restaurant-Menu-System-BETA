import React, { createContext, useContext, useState, useEffect } from "react";
import { AdminUser, LoginCredentials } from "@/admin/types/admin";
import supabase from "@/lib/supabase";
import { updateLastLogin } from "@/admin/services/userService";
import { SecurityManager } from "@/admin/utils/securityManager";

interface AdminAuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};

interface AdminAuthProviderProps {
  children: React.ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Security Check 1: Rate limiting & brute force protection
      const identifier = credentials.username;
      const loginCheck = SecurityManager.checkLoginAllowed(identifier);

      if (!loginCheck.allowed) {
        console.error(
          `Account locked. Try again in ${loginCheck.remainingTime} seconds`
        );
        alert(
          `Too many failed attempts. Account locked for ${Math.ceil(
            (loginCheck.remainingTime || 0) / 60
          )} minutes.`
        );
        return false;
      }

      // Security Check 2: Sanitize input
      const sanitizedUsername = SecurityManager.sanitizeInput(
        credentials.username
      );

      // Step 1: Authenticate with Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: sanitizedUsername.includes("@") ? sanitizedUsername : "", // Use email if provided
          password: credentials.password,
        });

      // If username was provided instead of email, we need to find the email first
      if (!sanitizedUsername.includes("@")) {
        // Find user by username to get email
        const { data: adminUser, error: userError } = await supabase
          .from("admin_users")
          .select("email")
          .eq("username", sanitizedUsername)
          .eq("is_active", true)
          .single();

        if (userError || !adminUser) {
          console.error("User not found:", userError);
          SecurityManager.recordLoginAttempt(identifier, false);
          return false;
        }

        // Try to authenticate with the found email
        const { data: authDataByEmail, error: authErrorByEmail } =
          await supabase.auth.signInWithPassword({
            email: adminUser.email,
            password: credentials.password,
          });

        if (authErrorByEmail || !authDataByEmail.user) {
          console.error("Authentication failed:", authErrorByEmail);
          SecurityManager.recordLoginAttempt(identifier, false);
          return false;
        }

        // Use the successful auth data
        authData.user = authDataByEmail.user;
        authData.session = authDataByEmail.session;
      } else if (authError || !authData.user) {
        console.error("Authentication failed:", authError);
        SecurityManager.recordLoginAttempt(identifier, false);
        return false;
      }

      // Step 2: Get admin user profile from admin_users table
      const { data: adminUser, error: profileError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("id", authData.user.id)
        .eq("is_active", true)
        .single();

      if (profileError || !adminUser) {
        console.error("Admin profile not found:", profileError);
        // Sign out from auth if profile doesn't exist
        await supabase.auth.signOut();
        SecurityManager.recordLoginAttempt(identifier, false);
        return false;
      }

      // Step 3: Update last login timestamp
      const { success: loginUpdateSuccess } = await updateLastLogin(
        adminUser.id
      );
      if (!loginUpdateSuccess) {
        console.warn("Failed to update last login timestamp");
        // Don't fail the login process for this
      }

      // Step 4: Create admin session record
      const sessionToken = `admin-${adminUser.id}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

      const { error: sessionError } = await supabase
        .from("admin_sessions")
        .insert({
          admin_user_id: adminUser.id,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString(),
          ip_address: null,
          user_agent: navigator.userAgent,
          is_active: true,
        });

      if (sessionError) {
        console.error("Session creation error:", sessionError);
        await supabase.auth.signOut();
        return false;
      }

      // Step 5: Store session data
      const currentTimestamp = new Date().toISOString();
      localStorage.setItem("admin_token", sessionToken);
      localStorage.setItem(
        "admin_user",
        JSON.stringify({
          id: adminUser.id,
          restaurant_id: adminUser.restaurant_id,
          username: adminUser.username,
          email: adminUser.email,
          full_name: adminUser.full_name,
          role: adminUser.role,
          is_active: adminUser.is_active,
          last_login: currentTimestamp, // Use current timestamp since we just updated it
          created_at: adminUser.created_at,
          updated_at: adminUser.updated_at,
        })
      );

      setUser({
        id: adminUser.id,
        restaurant_id: adminUser.restaurant_id,
        username: adminUser.username,
        email: adminUser.email,
        full_name: adminUser.full_name,
        role: adminUser.role,
        is_active: adminUser.is_active,
        last_login: currentTimestamp, // Use current timestamp since we just updated it
        created_at: adminUser.created_at,
        updated_at: adminUser.updated_at,
      });

      // Security: Record successful login and update activity
      SecurityManager.recordLoginAttempt(identifier, true);
      SecurityManager.updateActivity();
      SecurityManager.setCSRFToken();

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("admin_token");

      if (token) {
        // Deactivate session in database
        await supabase
          .from("admin_sessions")
          .update({ is_active: false })
          .eq("session_token", token);
      }

      // Sign out from Supabase Auth
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage regardless of database operation result
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      SecurityManager.clearSession();
      setUser(null);
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Security Check: Session timeout
      if (SecurityManager.checkSessionTimeout()) {
        console.log("Session timed out due to inactivity");
        await logout();
        return false;
      }

      // Check Supabase Auth session first
      const {
        data: { session },
        error: authError,
      } = await supabase.auth.getSession();

      if (authError || !session) {
        // Clear local storage if auth session is invalid
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        setUser(null);
        return false;
      }

      const token = localStorage.getItem("admin_token");
      if (!token) {
        setUser(null);
        return false;
      }

      // Verify admin session in database
      const { data: adminSession, error: sessionError } = await supabase
        .from("admin_sessions")
        .select(
          `
          *,
          admin_users (*)
        `
        )
        .eq("session_token", token)
        .eq("is_active", true)
        .single();

      if (sessionError || !adminSession) {
        console.error("Session not found or inactive:", sessionError);
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        setUser(null);
        return false;
      }

      // Check if session is expired
      const now = new Date();
      const expiresAt = new Date(adminSession.expires_at);

      if (now > expiresAt) {
        console.error("Session expired");
        // Deactivate expired session
        await supabase
          .from("admin_sessions")
          .update({ is_active: false })
          .eq("session_token", token);

        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        setUser(null);
        return false;
      }

      // Verify that the auth user ID matches the admin user ID
      if (session.user.id !== adminSession.admin_users.id) {
        console.error("Auth user ID mismatch");
        await supabase.auth.signOut();
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        setUser(null);
        return false;
      }

      // Check if user is still active
      if (!adminSession.admin_users.is_active) {
        console.error("User account is deactivated");
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        setUser(null);
        return false;
      }

      // Update user state with fresh data from database
      const adminUser = adminSession.admin_users;
      setUser({
        id: adminUser.id,
        restaurant_id: adminUser.restaurant_id,
        username: adminUser.username,
        email: adminUser.email,
        full_name: adminUser.full_name,
        role: adminUser.role,
        is_active: adminUser.is_active,
        last_login: adminUser.last_login,
        created_at: adminUser.created_at,
        updated_at: adminUser.updated_at,
      });

      // Update activity timestamp
      SecurityManager.updateActivity();

      return true;
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Set up activity monitoring
    const activityEvents = ["mousedown", "keydown", "scroll", "touchstart"];
    const updateActivity = () => SecurityManager.updateActivity();

    activityEvents.forEach((event) => {
      window.addEventListener(event, updateActivity);
    });

    // Check for session timeout every minute
    const timeoutInterval = setInterval(() => {
      if (isAuthenticated && SecurityManager.checkSessionTimeout()) {
        logout();
      }
    }, 60000); // Check every minute

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
      clearInterval(timeoutInterval);
    };
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
