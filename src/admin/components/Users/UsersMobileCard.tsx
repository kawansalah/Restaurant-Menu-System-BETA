import React from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { AdminUser, AdminRole } from "@/admin/types/admin";
import { Edit, Trash2, Eye, Activity, MoreVertical } from "lucide-react";
import {
  ActiveUsersIcon,
  SheildIcon,
  SheildUsersIcon,
  UsersIcon,
  CheckIcon,
  CrossIcon,
} from "@/admin/components/Icons";
import { ROLE_COLORS, STATUS_COLORS, TABLE_CONFIG } from "./UserConstants";

interface UserMobileCardAction {
  label: string;
  icon: React.ReactNode;
  onClick: (user: AdminUser) => void;
  variant: "primary" | "secondary" | "danger" | "success";
  disabled?: (user: AdminUser) => boolean;
}

interface UserMobileCardProps {
  user: AdminUser;
  onViewUser?: (user: AdminUser) => void;
  onEditUser?: (user: AdminUser) => void;
  onToggleStatus?: (user: AdminUser) => void;
  onDeleteUser?: (user: AdminUser) => void;
  onClick?: (user: AdminUser) => void;
  className?: string;
}

export function UserMobileCard({
  user,
  onViewUser,
  onEditUser,
  onToggleStatus,
  onDeleteUser,
  onClick,
  className = "",
}: UserMobileCardProps) {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const t = defaultAdminConfig.ui.users;
  const getText = (key: keyof typeof t) => t[key][language] || t[key].en;
  const [showActionsMenu, setShowActionsMenu] = React.useState(false);

  // Format date helper
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return getText("never");
    return new Date(dateString).toLocaleDateString(
      "en-US",
      TABLE_CONFIG.DATE_FORMAT_OPTIONS
    );
  };

  // Get role icon
  const getRoleIcon = (role: AdminRole) => {
    const iconMap = {
      super_admin: SheildIcon,
      admin: SheildUsersIcon,
      manager: ActiveUsersIcon,
      staff: UsersIcon,
    };
    const IconComponent = iconMap[role] || UsersIcon;
    return <IconComponent className="w-4 h-4" />;
  };

  // Get role display text
  const getRoleDisplayText = (role: AdminRole) => {
    const roleTextMap = {
      super_admin: getText("superAdmin"),
      admin: getText("admin"),
      manager: getText("manager"),
      staff: getText("staff"),
    };
    return roleTextMap[role] || getText("staff");
  };

  // Truncate email for display
  const truncateEmail = (email: string, maxLength: number = 25) => {
    if (email.length <= maxLength) return email;
    return email.substring(0, maxLength) + "...";
  };

  // Handle card click
  const handleCardClick = () => {
    if (onClick) {
      onClick(user);
    } else if (onEditUser) {
      onEditUser(user);
    } else if (onViewUser) {
      onViewUser(user);
    }
  };

  // Handle action click
  const handleActionClick = (
    action: UserMobileCardAction,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    action.onClick(user);
    setShowActionsMenu(false);
  };

  // Define actions
  const actions: UserMobileCardAction[] = [
    ...(onViewUser
      ? [
          {
            label: getText("viewDetails"),
            icon: <Eye className="w-4 h-4" />,
            onClick: onViewUser,
            variant: "secondary" as const,
          },
        ]
      : []),
    ...(onEditUser
      ? [
          {
            label: getText("editUser"),
            icon: <Edit className="w-4 h-4" />,
            onClick: onEditUser,
            variant: "primary" as const,
          },
        ]
      : []),
    ...(onToggleStatus
      ? [
          {
            label: getText("toggleStatus"),
            icon: <Activity className="w-4 h-4" />,
            onClick: onToggleStatus,
            variant: "success" as const,
          },
        ]
      : []),
    ...(onDeleteUser
      ? [
          {
            label: getText("deleteUser"),
            icon: <Trash2 className="w-4 h-4" />,
            onClick: onDeleteUser,
            variant: "danger" as const,
            disabled: (user: AdminUser) => user.role === "super_admin",
          },
        ]
      : []),
  ];

  return (
    <div
      className={`${theme.isDark ? theme.bgPrimary : theme.bgCard} relative rounded-[25px] ${
        theme.topbarShadowStyle
      } w-full ${
        onClick || onEditUser || onViewUser ? "cursor-pointer" : ""
      } ${className} mb-3 border ${theme.borderSubCategory} p-4 min-h-[140px]`}
      onClick={handleCardClick}
    >
      {/* Top Row: Status, Actions, Role */}
      <div className="flex items-start justify-between mb-3">
        {/* User ID Badge */}
        <div
          className={`inline-flex items-center justify-center h-6 px-2 py-1 rounded-full mb-2 ${
            user.is_active ? theme.bgMain : theme.bgSecondary
          }`}
        >
          <span
            className={`text-[10px] font-bold ${
              user.is_active ? "text-white" : theme.textSecondary
            }`}
          >
            #{user.id.toString().slice(-4)}
          </span>
        </div>

        {/* Right side: Actions Menu and Role Badge */}
        <div className="flex items-center gap-2">
          {/* Actions Menu */}
          {actions.length > 0 && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActionsMenu(!showActionsMenu);
                }}
                className={`${theme.bgSecondary} p-1 rounded-full w-[22px] h-[22px] flex items-center justify-center ${theme.itemHover} transition-colors`}
              >
                <MoreVertical className={`w-3 h-3 ${theme.isDark ? "text-white" : theme.textPrimary}`} />
              </button>

              {showActionsMenu && (
                <div
                  className={`absolute ${language === "en" ? "right-0" : "left-0"} top-full mt-1 z-10 ${theme.bgPrimary} rounded-lg ${theme.topbarShadowStyle} border ${theme.borderSubCategory} py-1 min-w-[140px]`}
                >
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={(e) => handleActionClick(action, e)}
                      disabled={action.disabled?.(user)}
                      className={`
                        w-full px-3 py-2 text-sm text-left flex items-center gap-2
                        transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                        ${theme.isDark ? theme.textSecondary : theme.textPrimary} ${theme.itemHover}
                        ${
                          action.variant === "danger"
                            ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            : ""
                        }
                      `}
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Status Badge */}
          <div
            className={`flex items-center gap-2 h-6 px-2 py-0.5 rounded-full ${
              user.is_active ? STATUS_COLORS.active : STATUS_COLORS.inactive
            }`}
          >
            {user.is_active ? (
              <CheckIcon className="w-3.5 h-3.5 text-white" />
            ) : (
              <CrossIcon className="w-3.5 h-3.5 text-white" />
            )}
            <span className="text-[12px] font-bold text-white">
              {user.is_active ? getText("active") : getText("inactive")}
            </span>
          </div>
        </div>
      </div>

      {/* Main User Info */}
      <div className="space-y-2 mb-4">
        {/* Name and Username */}
        <div>
          <div
            className={`text-left text-lg font-bold ${theme.isDark ? theme.textSecondary : theme.textPrimary} leading-tight`}
          >
            {user.full_name}
          </div>
          <div className={`text-left text-sm ${theme.isDark ? theme.textSecondary : theme.textPrimary}`}>
            @{user.username}
          </div>
        </div>

        {/* Email */}
        <div className={`text-sm ${theme.isDark ? theme.textSecondary : theme.textPrimary}`}>
          {truncateEmail(user.email)}
        </div>

        {/* Restaurant */}
        {user.restaurant && (
          <div className={`text-sm ${theme.isDark ? theme.textSecondary : theme.textPrimary}`}>
            <span className="font-medium">Restaurant: </span>
            <span>{user.restaurant.name}</span>
          </div>
        )}

        {/* Role */}
        <div
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            ROLE_COLORS[user.role]
          }`}
        >
          {getRoleIcon(user.role)}
          <span>{getRoleDisplayText(user.role)}</span>
        </div>
      </div>

      {/* Footer Info */}
      <div
        className={`flex flex-col sm:flex-row sm:justify-between gap-1 text-xs ${theme.textSecondary} pt-2 border-t ${theme.borderSubCategory}`}
      >
        <div>
          <span className="font-medium">{getText("lastLogin")}: </span>
          <span>{formatDate(user.last_login)}</span>
        </div>
        <div>
          <span className="font-medium">{getText("created")}: </span>
          <span>{formatDate(user.created_at)}</span>
        </div>
      </div>
    </div>
  );
}

// Export for backward compatibility
export default UserMobileCard;
