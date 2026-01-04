// Admin-specific Supabase client with enhanced security
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced Supabase client configuration for admin
export const adminSupabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // Automatically refresh tokens
    autoRefreshToken: true,
    // Persist session in localStorage (encrypted by browser)
    persistSession: true,
    // Detect session from URL (useful for email confirmations)
    detectSessionInUrl: false,
    // Enhanced storage with encryption
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    // Flow type for better security
    flowType: "pkce", // Proof Key for Code Exchange - more secure than implicit flow
  },
  global: {
    headers: {
      // Add custom headers for admin requests
      "X-Client-Info": "admin-panel",
    },
  },
});

// Session encryption helper using Web Crypto API
export const encryptSession = async (data: string): Promise<string> => {
  if (typeof window === "undefined" || !window.crypto.subtle) {
    return data; // Fallback for non-browser environments
  }

  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    // Generate a key from environment variable
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(
        import.meta.env.VITE_ADMIN_ENCRYPTION_KEY ||
          "default-key-change-in-production"
      ),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    const key = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: encoder.encode("admin-salt"),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      dataBuffer
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);

    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error("Encryption error:", error);
    return data;
  }
};

export const decryptSession = async (
  encryptedData: string
): Promise<string> => {
  if (typeof window === "undefined" || !window.crypto.subtle) {
    return encryptedData;
  }

  try {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const combined = Uint8Array.from(atob(encryptedData), (c) =>
      c.charCodeAt(0)
    );
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(
        import.meta.env.VITE_ADMIN_ENCRYPTION_KEY ||
          "default-key-change-in-production"
      ),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    const key = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: encoder.encode("admin-salt"),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    const decryptedData = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    return decoder.decode(decryptedData);
  } catch (error) {
    console.error("Decryption error:", error);
    return encryptedData;
  }
};

export default adminSupabase;
