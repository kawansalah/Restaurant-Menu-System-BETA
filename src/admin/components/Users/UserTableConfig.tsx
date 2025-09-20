import { useThemeClasses } from "@/hooks/useThemeClasses";
import { useLanguage } from "@/contexts/LanguageContext";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { TableColumn, TableAction } from "@/admin/components/Table";
import { AdminUser, AdminRole } from "@/admin/types/admin";
import { Edit, Trash2, Activity } from "lucide-react";
import { 
  ActiveUsersIcon, 
  SheildIcon, 
  SheildUsersIcon, 
  UsersIcon, 
  CheckIcon, 
  CrossIcon 
} from "@/admin/components/Icons";
import { ROLE_COLORS, STATUS_COLORS, TABLE_CONFIG } from "./UserConstants";
import { useAdminAuth } from "@/admin/contexts/AdminAuthContext";

interface UseUserTableConfigProps {
  onViewUser: (user: AdminUser) => void;
  onEditUser: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => void;
  onDeleteUser: (user: AdminUser) => void;
}

export const useUserTableConfig = ({
  // onViewUser,
  onEditUser,
  onToggleStatus,
  onDeleteUser,
}: UseUserTableConfigProps) => {
  const theme = useThemeClasses();
  const { language } = useLanguage();
  const { user: currentUser } = useAdminAuth();
  const t = defaultAdminConfig.ui.users;
  const getText = (key: keyof typeof t) => t[key][language] || t[key].en;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", TABLE_CONFIG.DATE_FORMAT_OPTIONS);
  };

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

  const getRoleDisplayText = (role: AdminRole) => {
    const roleTextMap = {
      super_admin: getText("superAdmin"),
      admin: getText("admin"),
      manager: getText("manager"),
      staff: getText("staff"),
    };
    return roleTextMap[role] || getText("staff");
  };

  const columns: TableColumn<AdminUser>[] = [
    {
      key: "full_name",
      title: getText("user"),
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div>
            <div
              className={`font-semibold ${
                theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
              }`}
            >
              {value}
            </div>
            <div className={`text-sm ${theme.textSecondary}`}>
              @{row.username}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "restaurant",
      title: "Restaurant",
      sortable: true,
      filterable: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <span
            className={`${
              theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
            }`}
          >
            {row.restaurant?.name || "N/A"}
          </span>
        </div>
      ),
    },
    {
      key: "email",
      title: getText("email"),
      sortable: true,
      filterable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <span
            className={`${
              theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
            }`}
          >
            {value}
          </span>
        </div>
      ),
    },
    {
      key: "role",
      title: getText("role"),
      sortable: true,
      filterable: true,
      align: "center",
      render: (value: AdminRole) => (
        <div className="flex items-center justify-center">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[16px] font-bold ${ROLE_COLORS[value]}`}
          >
            {getRoleIcon(value)}
            {getRoleDisplayText(value)}
          </span>
        </div>
      ),
    },
    {
      key: "is_active",
      title: getText("status"),
      sortable: true,
      align: "center",
      render: (value: boolean) => (
        <div className="flex items-center justify-center">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[16px] font-medium ${
              value ? STATUS_COLORS.active : STATUS_COLORS.inactive
            }`}
          >
            {value ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <CrossIcon className="w-4 h-4" />
            )}
            {value ? getText("active") : getText("inactive")}
          </span>
        </div>
      ),
    },
    {
      key: "last_login",
      title: getText("lastLogin"),
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <span
            className={`text-sm ${
              theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
            }`}
          >
            {value ? formatDate(value) : getText("never")}
          </span>
        </div>
      ),
    },
    {
      key: "created_at",
      title: getText("created"),
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <span
            className={`text-sm ${
              theme.isDark ? theme.buttonTextPrimary : theme.textPrimary
            }`}
          >
            {formatDate(value)}
          </span>
        </div>
      ),
    },
  ];

  const actions: TableAction<AdminUser>[] = [
    // {
    //   label: getText("viewDetails"),
    //   icon: <Eye className="w-4 h-4" />,
    //   onClick: onViewUser,
    //   variant: "secondary",
    // },
    {
      label: getText("editUser"),
      icon: <Edit className="w-4 h-4" />,
      onClick: onEditUser,
      variant: "primary",
      disabled: (user) => {
        // Staff can only edit their own profile
        if (currentUser?.role === 'staff') {
          return user.id !== currentUser.id;
        }
        return false;
      },
    },
    {
      label: getText("toggleStatus"),
      icon: <Activity className="w-4 h-4" />,
      onClick: onToggleStatus,
      variant: "success",
      disabled: (user) => {
        // Staff cannot toggle any user status
        if (currentUser?.role === 'staff') {
          return true;
        }
        return false;
      },
    },
    {
      label: getText("deleteUser"),
      icon: <Trash2 className="w-4 h-4" />,
      onClick: onDeleteUser,
      variant: "danger",
      disabled: (user) => {
        // Staff cannot delete any users
        if (currentUser?.role === 'staff') {
          return true;
        }
        // Super admin cannot be deleted by anyone
        return user.role === "super_admin";
      },
    },
  ];

  return { columns, actions };
};