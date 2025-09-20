import React, { useState, useEffect } from "react";
import { useThemeClasses } from "@/hooks/useThemeClasses";
import Table from "@/admin/components/Table";
import { AdminUser, AdminRole } from "@/admin/types/admin";
import {
  fetchUsers,
  deleteUser,
  toggleUserStatus,
  bulkUpdateUsers,
  bulkDeleteUsers,
  getUserStats,
  updateUser,
  createUser,
} from "@/admin/services/userService";
import UserStatsCards from "@/admin/components/Users/UserStatsCards";
import UserFormModal from "@/admin/components/Users/UserFormModal";
import UserBulkActions from "@/admin/components/Users/UserBulkActions";
import { useUserTableConfig } from "@/admin/components/Users/UserTableConfig";
import { useUserUtils } from "@/admin/components/Users/UserUtils";
import { defaultAdminConfig } from "@/admin/config/adminConfig";
import { useLanguage } from "@/contexts/LanguageContext";
import { TABLE_CONFIG, ERROR_MESSAGES } from "@/admin/components/Users/UserConstants";
import { UserMobileCard } from "../components/Users/UsersMobileCard";
import MobileFilterModal from "../components/MobileFilterModal";
import { Plus, Filter, RefreshCw } from "lucide-react";

interface UserFormData {
  restaurant_id?: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  role: AdminRole;
  is_active: boolean;
}

const Users: React.FC = () => {
  const theme = useThemeClasses();
  const { getText, getErrorMessage, handleExportUsers } = useUserUtils();
  const { language } = useLanguage();
  const getLoadingText = () => {
    const loadingConfig = defaultAdminConfig.ui.loading;
    return loadingConfig[language] || loadingConfig.en || "Loading...";
  };

  // State management
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<AdminUser[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byRole: { super_admin: 0, admin: 0, manager: 0, staff: 0 } as Record<
      AdminRole,
      number
    >,
  });

  // Mobile filter modal state
  const [showMobileFilterModal, setShowMobileFilterModal] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [mobileColumnFilters, setMobileColumnFilters] = useState<Record<string, string>>({});
  const [mobileColumnVisibility, setMobileColumnVisibility] = useState<Record<string, boolean>>({});
  const [mobileSortConfig, setMobileSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  // Load data
  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await fetchUsers();

      if (fetchError) {
        setError(fetchError);
        console.error("Failed to load users:", fetchError);
      } else {
        setUsers(data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : getText("failedToLoad");
      setError(errorMessage);
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mobile filter handlers
  const handleMobileFilterOpen = () => {
    setShowMobileFilterModal(true);
  };

  const handleMobileFilterClose = () => {
    setShowMobileFilterModal(false);
  };

  const handleMobileClearAll = () => {
    setMobileSearchQuery("");
    setMobileColumnFilters({});
    setMobileSortConfig(null);
  };

  const handleMobileApply = () => {
    try {
      // Apply filters to mobile view
      console.log('Applied filters:', {
        search: mobileSearchQuery,
        columnFilters: mobileColumnFilters,
        sort: mobileSortConfig,
        visibility: mobileColumnVisibility
      });
      
      // Close the modal automatically after applying filters
      setShowMobileFilterModal(false);
    } catch (error) {
      console.error('Error applying mobile filters:', error);
    }
  };

  // Filter users for mobile view
  const getFilteredUsers = () => {
    try {
      let filtered = [...users];

      // Apply search filter
      if (mobileSearchQuery) {
        const searchTerm = mobileSearchQuery.toLowerCase().trim();
        filtered = filtered.filter((user) => {
          // Search in text fields
          const textFields = [user.username, user.email, user.full_name, user.role];
          const textMatch = textFields.some(field => 
            field?.toString().toLowerCase().includes(searchTerm)
          );
          
          // Search in boolean field (is_active)
          const statusMatch = (
            (searchTerm === 'active' && user.is_active) ||
            (searchTerm === 'inactive' && !user.is_active) ||
            (searchTerm === 'true' && user.is_active) ||
            (searchTerm === 'false' && !user.is_active)
          );
          
          // Search in date fields
          const dateMatch = [user.created_at, user.updated_at, user.last_login]
            .filter(Boolean)
            .some(date => {
              try {
                const formattedDate = new Date(date!).toLocaleDateString();
                return formattedDate.toLowerCase().includes(searchTerm);
              } catch {
                return false;
              }
            });
          
          return textMatch || statusMatch || dateMatch;
        });
      }

      // Apply column filters
      Object.entries(mobileColumnFilters).forEach(([key, filterValue]) => {
        if (filterValue && filterValue.trim()) {
          const filterTerm = filterValue.toLowerCase().trim();
          
          filtered = filtered.filter((user) => {
            const value = user[key as keyof AdminUser];
            
            if (value === null || value === undefined) {
              return false;
            }
            
            // Handle different data types
            switch (key) {
              case 'is_active':
                 // Boolean filtering
                 if (filterTerm === 'true') {
                   return value === true;
                 }
                 if (filterTerm === 'false') {
                   return value === false;
                 }
                 // For text search, allow 'active'/'inactive' terms
                 if (filterTerm === 'active') {
                   return value === true;
                 }
                 if (filterTerm === 'inactive') {
                   return value === false;
                 }
                 return value.toString().toLowerCase().includes(filterTerm);
                 
               case 'role':
                 // Enum filtering - exact match for dropdown, partial for text search
                 if (['super_admin', 'admin', 'manager', 'staff'].includes(filterTerm)) {
                   return value === filterTerm;
                 }
                 return value.toString().toLowerCase().includes(filterTerm);
                 
               case 'created_at':
               case 'updated_at':
               case 'last_login':
                 // Date filtering
                 try {
                   const dateValue = new Date(value as string);
                   
                   // If filter term looks like a date (YYYY-MM-DD), do exact date match
                   if (/^\d{4}-\d{2}-\d{2}$/.test(filterTerm)) {
                     const filterDate = new Date(filterTerm);
                     const valueDate = new Date(dateValue.toDateString()); // Remove time component
                     const filterDateOnly = new Date(filterDate.toDateString());
                     return valueDate.getTime() === filterDateOnly.getTime();
                   }
                   
                   // Otherwise, do partial string matching
                   const formattedDate = dateValue.toLocaleDateString();
                   const isoDate = dateValue.toISOString().split('T')[0];
                   return formattedDate.toLowerCase().includes(filterTerm) ||
                          isoDate.includes(filterTerm);
                 } catch {
                   return false;
                 }
                
              default:
                // String filtering
                return value.toString().toLowerCase().includes(filterTerm);
            }
          });
        }
      });

      // Apply sorting
      if (mobileSortConfig) {
        filtered.sort((a, b) => {
          const aValue = a[mobileSortConfig.key as keyof AdminUser];
          const bValue = b[mobileSortConfig.key as keyof AdminUser];
          
          // Handle null/undefined values
          if (aValue === null || aValue === undefined) {
            return bValue === null || bValue === undefined ? 0 : 1;
          }
          if (bValue === null || bValue === undefined) {
            return -1;
          }
          
          // Handle different data types for sorting
          let comparison = 0;
          
          switch (mobileSortConfig.key) {
            case 'created_at':
            case 'updated_at':
            case 'last_login':
              // Date sorting
              const dateA = new Date(aValue as string).getTime();
              const dateB = new Date(bValue as string).getTime();
              comparison = dateA - dateB;
              break;
              
            case 'is_active':
              // Boolean sorting (true first)
              comparison = (bValue as boolean ? 1 : 0) - (aValue as boolean ? 1 : 0);
              break;
              
            default:
              // String/number sorting
              if (aValue < bValue) comparison = -1;
              else if (aValue > bValue) comparison = 1;
              else comparison = 0;
          }
          
          return mobileSortConfig.direction === "asc" ? comparison : -comparison;
        });
      }

      return filtered;
    } catch (error) {
      console.error('Error filtering users:', error);
      return users; // Return original users if filtering fails
    }
  };

  const filteredUsers = getFilteredUsers();

  const loadStats = async () => {
    try {
      const { data, error: statsError } = await getUserStats();

      if (statsError) {
        console.error("Failed to load stats:", statsError);
      } else {
        setStats(data);
      }
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };

  // Table event handlers
  const handleViewUser = (user: AdminUser) => {
    console.log("View user:", user);
    // TODO: Implement view user details modal
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleToggleStatus = async (user: AdminUser) => {
    try {
      const { data, error } = await toggleUserStatus(user.id);

      if (error) {
        alert(`${getText("failedToToggleStatus")}: ${error}`);
      } else if (data) {
        setUsers((prev) => prev.map((u) => (u.id === user.id ? data : u)));
        loadStats();
      }
    } catch (err) {
      console.error("Error toggling user status:", err);
      alert(getText("failedToToggleStatus"));
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (window.confirm(`${getText("confirmDelete")} ${user.full_name}?`)) {
      try {
        const { success, error } = await deleteUser(user.id);

        if (error) {
          alert(`${getText("failedToDelete")}: ${error}`);
        } else if (success) {
          setUsers((prev) => prev.filter((u) => u.id !== user.id));
          loadStats();
        }
      } catch (err) {
        console.error("Error deleting user:", err);
        alert(getText("failedToDelete"));
      }
    }
  };

  // Table configuration
  const { columns, actions } = useUserTableConfig({
    onViewUser: handleViewUser,
    onEditUser: handleEditUser,
    onToggleStatus: handleToggleStatus,
    onDeleteUser: handleDeleteUser,
  });

  // Initialize mobile column visibility
  useEffect(() => {
    if (columns.length > 0 && Object.keys(mobileColumnVisibility).length === 0) {
      const initialVisibility: Record<string, boolean> = { '__id__': true };
      columns.forEach(col => {
        initialVisibility[col.key] = true;
      });
      setMobileColumnVisibility(initialVisibility);
    }
  }, [columns, mobileColumnVisibility]);

  // Form handlers
  const handleFormSubmit = async (formData: UserFormData) => {
    setIsSubmitting(true);

    try {
      if (editingUser) {
        // Update existing user
        const { data, error } = await updateUser(editingUser.id, {
          restaurant_id: formData.restaurant_id,
          username: formData.username,
          email: formData.email,
          full_name: formData.full_name,
          role: formData.role,
          is_active: formData.is_active,
        });

        if (error) {
          alert(`Failed to update user: ${error}`);
        } else if (data) {
          alert("User updated successfully");
          setShowUserModal(false);
          setEditingUser(null);
          loadUsers();
          loadStats();
        }
      } else {
        // Create new user
        const result = await createUser({
          restaurant_id: formData.restaurant_id,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          role: formData.role,
        });

        if (result.error) {
          const errorMessage = getErrorMessage(result.error, formData);
          alert(`Failed to create user: ${errorMessage}`);
        } else if (result.success) {
          alert("User created successfully");
          setShowUserModal(false);
          loadUsers();
          loadStats();
        }
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert(ERROR_MESSAGES.UNEXPECTED_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowUserModal(false);
    setEditingUser(null);
  };

  // Action handlers
  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };

  const handleExportUsersClick = () => {
    handleExportUsers(users);
  };

  const handleRefreshUsers = async () => {
    await loadUsers();
    await loadStats();
  };

  const handleSelectionChange = (selected: AdminUser[]) => {
    setSelectedUsers(selected);
  };

  const handleRowClick = (user: AdminUser) => {
    console.log("Row clicked:", user);
    // TODO: Navigate to user details page or open modal
  };

  // Bulk action handlers
  const handleBulkActivate = async () => {
    try {
      const userIds = selectedUsers.map((u) => u.id);
      const { error } = await bulkUpdateUsers(userIds, { is_active: true });

      if (error) {
        alert(`${getText("failedToActivate")}: ${error}`);
      } else {
        setUsers((prev) =>
          prev.map((user) =>
            selectedUsers.some((selected) => selected.id === user.id)
              ? {
                  ...user,
                  is_active: true,
                  updated_at: new Date().toISOString(),
                }
              : user
          )
        );
        setSelectedUsers([]);
        loadStats();
      }
    } catch (err) {
      console.error("Error activating users:", err);
      alert(getText("failedToActivate"));
    }
  };

  const handleBulkDeactivate = async () => {
    try {
      const userIds = selectedUsers.map((u) => u.id);
      const { error } = await bulkUpdateUsers(userIds, { is_active: false });

      if (error) {
        alert(`${getText("failedToDeactivate")}: ${error}`);
      } else {
        setUsers((prev) =>
          prev.map((user) =>
            selectedUsers.some((selected) => selected.id === user.id)
              ? {
                  ...user,
                  is_active: false,
                  updated_at: new Date().toISOString(),
                }
              : user
          )
        );
        setSelectedUsers([]);
        loadStats();
      }
    } catch (err) {
      console.error("Error deactivating users:", err);
      alert(getText("failedToDeactivate"));
    }
  };

  const handleBulkDelete = async () => {
    const userCount = selectedUsers.length;
    const userText =
      userCount > 1
        ? `${userCount} ${getText("selectedUsers")}`
        : selectedUsers[0]?.full_name;

    if (window.confirm(`${getText("confirmBulkDelete")} ${userText}?`)) {
      try {
        const userIds = selectedUsers.map((u) => u.id);
        const { success, error } = await bulkDeleteUsers(userIds);

        if (error) {
          alert(`${getText("failedToDelete")}: ${error}`);
        } else if (success) {
          setUsers((prev) =>
            prev.filter(
              (user) =>
                !selectedUsers.some((selected) => selected.id === user.id)
            )
          );
          setSelectedUsers([]);
          loadStats();
        }
      } catch (err) {
        console.error("Error deleting users:", err);
        alert(getText("failedToDelete"));
      }
    }
  };

  return (
    <div className={`min-h-screen ${theme.bgPrimary} py-6`}>
      <div className="w-full mx-auto space-y-6">
        {/* Error Message */}
        {error && (
          <div
            className={`${theme.bgCard} border ${theme.borderCategory} ${theme.textPrimary} px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300`}
          >
            <strong>{getText("errorPrefix")}</strong> {error}
            <button
              onClick={() => setError(null)}
              className="float-right text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100"
            >
              ×
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1
            className={`text-2xl font-bold ${
              theme.isDark ? theme.textSecondary : theme.textPrimary
            } `}
          >
            {getText("pageTitle")}
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefreshUsers}
              disabled={loading}
              className={`p-2 rounded-xl ${theme.bgSecondary} ${theme.textSecondary} border ${theme.borderSubCategory} hover:${theme.bgCard} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={() => setShowMobileFilterModal(true)}
              className={`p-2 rounded-xl ${theme.bgSecondary} ${theme.textSecondary} border ${theme.borderSubCategory} hover:${theme.bgCard} transition-colors flex items-center gap-2`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <UserStatsCards stats={stats} />

        {/* Desktop/Tablet Table View */}
        <div className="hidden md:block">
          <Table
            data={users}
            columns={columns}
            actions={actions}
            searchable={true}
            filterable={true}
            sortable={true}
            pagination={true}
            pageSize={TABLE_CONFIG.PAGE_SIZE}
            loading={loading}
            emptyMessage={getText("noUsersFound")}
            selectable={true}
            onAdd={handleAddUser}
            onExport={handleExportUsersClick}
            onRefresh={handleRefreshUsers}
            onSelectionChange={handleSelectionChange}
            onRowClick={handleRowClick}
            className="animate-fade-in"
          />
        </div>

        {/* Mobile Cards View */}
        <div className="block md:hidden space-y-4">
          <div className={`${theme.bgCard} rounded-3xl p-4 border ${theme.borderCategory}`}>
            <h2 className={`text-lg font-bold ${theme.isDark ? theme.textSecondary : theme.textPrimary} mb-4`}>
              {getText("pageTitle")}
            </h2>
            <div className="space-y-3">
              {loading ? (
                <div className={`text-center py-8 ${theme.textSecondary}`}>
                  {getLoadingText()}
                </div>
              ) : users.length === 0 ? (
                <div className={`text-center py-8 ${theme.textSecondary}`}>
                  {getText("noUsersFound")}
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <UserMobileCard
                    key={user.id}
                    user={user}
                    onEditUser={handleEditUser}
                    onDeleteUser={handleDeleteUser}
                    onToggleStatus={handleToggleStatus}
                    onViewUser={handleViewUser}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <UserBulkActions
          selectedUsers={selectedUsers}
          onBulkActivate={handleBulkActivate}
          onBulkDeactivate={handleBulkDeactivate}
          onBulkDelete={handleBulkDelete}
        />
      </div>
      
      {/* User Form Modal */}
      <UserFormModal
        isOpen={showUserModal}
        editingUser={editingUser}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Floating Action Button */}
      <button
        onClick={handleAddUser}
        className={`fixed md:hidden bottom-6 right-6 w-14 h-14 ${theme.bgMain} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center z-40 ${theme.topbarShadowStyle}`}
        aria-label={getText("addUser")}
      >
        <Plus className="w-6 h-6 stroke-6" />
      </button>

      {/* Floating Filter Button */}
      <button
        onClick={handleMobileFilterOpen}
        className={`fixed md:hidden bottom-6 left-6 w-14 h-14 bg-[#4e7dff] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center z-40 ${theme.topbarShadowStyle}`}
        aria-label="Filter"
      >
        <Filter className="w-6 h-6 stroke-6" />
      </button>

      {/* Mobile Filter Modal */}
      <MobileFilterModal
        isOpen={showMobileFilterModal}
        onClose={handleMobileFilterClose}
        columns={columns}
        searchQuery={mobileSearchQuery}
        onSearchChange={setMobileSearchQuery}
        columnFilters={mobileColumnFilters}
        onColumnFiltersChange={setMobileColumnFilters}
        columnVisibility={mobileColumnVisibility}
        onColumnVisibilityChange={setMobileColumnVisibility}
        sortConfig={mobileSortConfig}
        onSortChange={setMobileSortConfig}
        showIdColumn={true}
        idColumnTitle="ID"
        searchable={true}
        filterable={true}
        sortable={true}
        showColumnVisibility={true}
        onClearAll={handleMobileClearAll}
        onApply={handleMobileApply}
      />
    </div>
  );
};

export default Users;
