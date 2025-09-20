# Custom Alert System

A localized, theme-aware alert system that replaces native browser alerts with beautiful modals matching your application's design.

## Features

- 🌍 **Fully Localized**: Kurdish, Arabic, and English support from menu config
- 🎨 **Theme Integration**: Automatically adapts to light/dark themes
- 🔄 **Promise-based**: Easy async/await handling
- ♿ **Accessible**: Keyboard navigation, ARIA labels, focus management
- 📱 **Responsive**: Works seamlessly on all devices

## Usage

### Basic Import

```typescript
import { useAlerts } from "@/hooks/useAlerts";

function MyComponent() {
  const alerts = useAlerts();
  // Use alerts...
}
```

### Common Alert Types

```typescript
// Success (auto-closes in 3 seconds)
await alerts.showSuccess("Operation completed successfully!");

// Error
await alerts.showError("Something went wrong");

// Warning
await alerts.showWarning("Please save your work");

// Info
await alerts.showInfo("This is information");

// Delete confirmation
const confirmed = await alerts.confirmDelete("User Account");
if (confirmed) {
  // Proceed with deletion
}

// Logout confirmation
const confirmed = await alerts.confirmLogout();

// Unsaved changes confirmation
const confirmed = await alerts.confirmUnsavedChanges();

// Generic confirmation
const confirmed = await alerts.confirm("Are you sure?");
```

### Localization

All text is automatically localized based on the current language from `LanguageContext`. Text is configured in `src/config/menuConfig.ts` under `ui.alerts`:

- **Buttons**: ok, yes, no, cancel, confirm, delete, save, close
- **Titles**: success, error, warning, information, confirmation, deleteConfirmation
- **Messages**: deleteItem, unsavedChanges, logout, operationSuccess, operationFailed, networkError

### Integration

The system is already integrated:

- `AlertProvider` is wrapped around your app in `App.jsx`
- Replace native `alert()` and `confirm()` calls with the custom alerts
- All alerts automatically use your theme colors and fonts

### Example Migration

```typescript
// Before
alert("Error occurred");
if (confirm("Delete this?")) {
  deleteItem();
}

// After
await alerts.showError("Error occurred");
const confirmed = await alerts.confirmDelete();
if (confirmed) {
  deleteItem();
}
```

The alert system provides a much better user experience than native browser alerts and maintains consistency with your application's design and language preferences.
