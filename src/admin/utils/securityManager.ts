// Rate limiting and brute force protection utilities
interface LoginAttempt {
  count: number;
  timestamp: number;
  blockedUntil?: number;
}

const LOGIN_ATTEMPTS_KEY = "admin_login_attempts";
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW = 5 * 60 * 1000; // 5 minutes

export class SecurityManager {
  private static getAttempts(identifier: string): LoginAttempt {
    const stored = localStorage.getItem(`${LOGIN_ATTEMPTS_KEY}_${identifier}`);
    if (!stored) {
      return { count: 0, timestamp: Date.now() };
    }
    return JSON.parse(stored);
  }

  private static setAttempts(identifier: string, attempts: LoginAttempt): void {
    localStorage.setItem(
      `${LOGIN_ATTEMPTS_KEY}_${identifier}`,
      JSON.stringify(attempts)
    );
  }

  static checkLoginAllowed(identifier: string): {
    allowed: boolean;
    remainingTime?: number;
  } {
    const attempts = this.getAttempts(identifier);
    const now = Date.now();

    // Check if account is locked
    if (attempts.blockedUntil && attempts.blockedUntil > now) {
      return {
        allowed: false,
        remainingTime: Math.ceil((attempts.blockedUntil - now) / 1000),
      };
    }

    // Reset attempts if window has passed
    if (now - attempts.timestamp > ATTEMPT_WINDOW) {
      this.setAttempts(identifier, { count: 0, timestamp: now });
      return { allowed: true };
    }

    // Check if max attempts reached
    if (attempts.count >= MAX_ATTEMPTS) {
      const blockedUntil = attempts.timestamp + LOCKOUT_DURATION;
      this.setAttempts(identifier, { ...attempts, blockedUntil });
      return {
        allowed: false,
        remainingTime: Math.ceil((blockedUntil - now) / 1000),
      };
    }

    return { allowed: true };
  }

  static recordLoginAttempt(identifier: string, success: boolean): void {
    if (success) {
      // Clear attempts on successful login
      localStorage.removeItem(`${LOGIN_ATTEMPTS_KEY}_${identifier}`);
      return;
    }

    const attempts = this.getAttempts(identifier);
    const now = Date.now();

    // Reset if window has passed
    if (now - attempts.timestamp > ATTEMPT_WINDOW) {
      this.setAttempts(identifier, { count: 1, timestamp: now });
    } else {
      this.setAttempts(identifier, {
        count: attempts.count + 1,
        timestamp: attempts.timestamp,
      });
    }
  }

  static clearAttempts(identifier: string): void {
    localStorage.removeItem(`${LOGIN_ATTEMPTS_KEY}_${identifier}`);
  }

  // Session timeout management
  private static SESSION_ACTIVITY_KEY = "admin_last_activity";
  private static SESSION_TIMEOUT = parseInt(
    import.meta.env.VITE_SESSION_TIMEOUT || "3600000"
  ); // 1 hour default

  static updateActivity(): void {
    localStorage.setItem(this.SESSION_ACTIVITY_KEY, Date.now().toString());
  }

  static checkSessionTimeout(): boolean {
    const lastActivity = localStorage.getItem(this.SESSION_ACTIVITY_KEY);
    if (!lastActivity) return false;

    const timeSinceActivity = Date.now() - parseInt(lastActivity);
    return timeSinceActivity > this.SESSION_TIMEOUT;
  }

  static clearSession(): void {
    localStorage.removeItem(this.SESSION_ACTIVITY_KEY);
  }

  // Content Security helpers
  static sanitizeInput(input: string): string {
    // Basic XSS prevention
    return input
      .replace(/[<>]/g, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+=/gi, "")
      .trim();
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push(
        "Password must contain at least one special character (!@#$%^&*)"
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // CSRF Token management
  static generateCSRFToken(): string {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  }

  static setCSRFToken(): string {
    const token = this.generateCSRFToken();
    sessionStorage.setItem("csrf_token", token);
    return token;
  }

  static getCSRFToken(): string | null {
    return sessionStorage.getItem("csrf_token");
  }

  static validateCSRFToken(token: string): boolean {
    const storedToken = this.getCSRFToken();
    return storedToken === token;
  }
}
