import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  lazy,
  Suspense,
} from "react";

export interface AlertOptions {
  title: string;
  message: string;
  type: "confirm" | "alert" | "warning" | "error" | "success";
  confirmText?: string;
  cancelText?: string;
  okText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  showCancel?: boolean;
  icon?: ReactNode;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

interface AlertState {
  isOpen: boolean;
  options: AlertOptions | null;
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => Promise<boolean>;
  showConfirm: (
    options: Omit<AlertOptions, "type" | "showCancel">
  ) => Promise<boolean>;
  showWarning: (options: Omit<AlertOptions, "type">) => Promise<boolean>;
  showError: (options: Omit<AlertOptions, "type">) => Promise<boolean>;
  showSuccess: (options: Omit<AlertOptions, "type">) => Promise<boolean>;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

// Lazy load the AlertModal to avoid circular dependency
const AlertModal = lazy(() => import("../components/AlertModal"));

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    options: null,
  });
  const [resolveCallback, setResolveCallback] = useState<
    ((value: boolean) => void) | null
  >(null);

  const showAlert = (options: AlertOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setResolveCallback(() => resolve);
      setAlertState({
        isOpen: true,
        options: {
          showCancel: options.type === "confirm",
          ...options,
        },
      });

      // Auto close for success/info alerts
      if (options.autoClose && options.autoCloseDelay) {
        setTimeout(() => {
          hideAlert();
          resolve(true);
        }, options.autoCloseDelay);
      }
    });
  };

  const showConfirm = (
    options: Omit<AlertOptions, "type" | "showCancel">
  ): Promise<boolean> => {
    return showAlert({
      ...options,
      type: "confirm",
      showCancel: true,
    });
  };

  const showWarning = (
    options: Omit<AlertOptions, "type">
  ): Promise<boolean> => {
    return showAlert({
      ...options,
      type: "warning",
    });
  };

  const showError = (options: Omit<AlertOptions, "type">): Promise<boolean> => {
    return showAlert({
      ...options,
      type: "error",
    });
  };

  const showSuccess = (
    options: Omit<AlertOptions, "type">
  ): Promise<boolean> => {
    return showAlert({
      ...options,
      type: "success",
      autoClose: options.autoClose ?? true,
      autoCloseDelay: options.autoCloseDelay ?? 3000,
    });
  };

  const hideAlert = () => {
    setAlertState({
      isOpen: false,
      options: null,
    });
    if (resolveCallback) {
      resolveCallback(false);
      setResolveCallback(null);
    }
  };

  const handleConfirm = async () => {
    if (alertState.options?.onConfirm) {
      await alertState.options.onConfirm();
    }
    if (resolveCallback) {
      resolveCallback(true);
      setResolveCallback(null);
    }
    setAlertState({
      isOpen: false,
      options: null,
    });
  };

  const handleCancel = async () => {
    if (alertState.options?.onCancel) {
      await alertState.options.onCancel();
    }
    hideAlert();
  };

  const value = {
    showAlert,
    showConfirm,
    showWarning,
    showError,
    showSuccess,
    hideAlert,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      {alertState.isOpen && alertState.options && (
        <Suspense fallback={null}>
          <AlertModal
            options={alertState.options}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            onClose={hideAlert}
          />
        </Suspense>
      )}
    </AlertContext.Provider>
  );
};
