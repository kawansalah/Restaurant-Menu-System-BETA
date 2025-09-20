import React from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { AdminUser } from "@/admin/types/admin";
import { UserCheck, UserX, Trash2 } from "lucide-react";

interface UserBulkActionsProps {
  selectedUsers: AdminUser[];
  onBulkActivate: () => void;
  onBulkDeactivate: () => void;
  onBulkDelete: () => void;
}

const UserBulkActions: React.FC<UserBulkActionsProps> = ({
  selectedUsers,
  onBulkActivate,
  onBulkDeactivate,
  onBulkDelete,
}) => {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const t = defaultAdminConfig.ui.users;
  const getText = (key: keyof typeof t) => t[key][language] || t[key].en;

  if (selectedUsers.length === 0) {
    return null;
  }

  const hasSuperAdmin = selectedUsers.some((user) => user.role === "super_admin");

  return (
    <div
      className={`${theme.bgCard} rounded-3xl p-3 sm:p-4 ${theme.topbarShadowStyle} border ${theme.borderCategory}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full ${theme.bgMain} flex items-center justify-center ${theme.buttonTextPrimary} font-bold text-sm`}
          >
            {selectedUsers.length}
          </div>
          <span
            className={`font-semibold text-sm sm:text-base ${
              theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
            }`}
          >
            {getText("selectedUsers")}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
          <button
            onClick={onBulkActivate}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#119560] dark:bg-[#119560] text-white font-medium hover:bg-[#119560] dark:hover:bg-[#119560] transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            <UserCheck className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">{getText("activate")}</span>
          </button>

          <button
            onClick={onBulkDeactivate}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#e98e0f] dark:bg-[#e98e0f] text-white font-medium hover:bg-[#e98e0f] dark:hover:bg-[#e98e0f] transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            <UserX className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">{getText("deactivate")}</span>
          </button>

          <button
            onClick={onBulkDelete}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#f86262] dark:bg-[#f86262] text-white font-medium hover:bg-[#f86262] dark:hover:bg-[#f86262] transition-all duration-200 hover:scale-105 active:scale-95 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={hasSuperAdmin}
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">{getText("delete")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserBulkActions;