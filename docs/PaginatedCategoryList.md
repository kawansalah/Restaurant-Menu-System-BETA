# Paginated Category List Component

## Overview

The `PaginatedCategoryList` component provides an enhanced mobile-friendly interface for displaying categories with automatic pagination. It loads 10 categories initially and provides a "Load More" button for additional items.

## Features

### 🚀 **Auto Pagination**

- **Initial Load**: Displays first 10 categories
- **Load More**: Button to load additional 10 categories at a time
- **Smooth Scrolling**: Automatically scrolls to new items when loaded
- **End Detection**: Shows "All categories loaded" when reaching the end

### 🎨 **Professional Loading States**

1. **Skeleton Loader**: For initial page load

   - Animated placeholders matching the actual card layout
   - Shimmer effects for enhanced visual appeal
   - Staggered animation delays for each skeleton card

2. **Load More Loader**: For subsequent loads

   - Multi-layered spinner with counter-rotating rings
   - Animated loading dots with bounce effects
   - Progress bar with shimmer animation
   - Dynamic loading text

3. **Button Animations**:
   - Hover effects with scale and shadow transitions
   - Icon rotation on hover
   - Shimmer background effect
   - Pulse indicator dot

### 🔍 **Advanced Functionality**

- **Search Integration**: Supports real-time search filtering
- **Filter Support**: Works with column-based filters
- **Error Handling**: Graceful error states with retry functionality
- **Empty States**: Contextual messages for different scenarios
- **Performance**: Simulated network delay for better UX

## Usage

```tsx
import PaginatedCategoryList from "@/admin/components/PaginatedCategoryList";

<PaginatedCategoryList
  onEdit={handleEditCategory}
  onDelete={handleDeleteCategory}
  onClick={handleCategoryClick}
  searchQuery={searchTerm}
  filters={activeFilters}
  className="custom-styles"
/>;
```

## Props

| Prop          | Type                                                  | Description                          | Default |
| ------------- | ----------------------------------------------------- | ------------------------------------ | ------- |
| `onEdit`      | `(category: Category) => void`                        | Callback for editing a category      | -       |
| `onDelete`    | `(category: Category) => void`                        | Callback for deleting a category     | -       |
| `onClick`     | `(category: Category) => void`                        | Callback for clicking a category     | -       |
| `searchQuery` | `string`                                              | Search term for filtering categories | `""`    |
| `filters`     | `Record<string, string>`                              | Additional filters to apply          | `{}`    |
| `sortConfig`  | `{ key: string; direction: "asc" \| "desc" } \| null` | Sort configuration                   | `null`  |
| `className`   | `string`                                              | Additional CSS classes               | `""`    |

## Recent Fixes (Latest Update)

### 🔧 **Fixed Supabase Query Syntax**

- **Problem**: Supabase `ilike` operator was using incorrect `%` wildcards
- **Solution**: Changed from `label_ku.ilike.%term%` to `label_ku.ilike.*term*`
- **Impact**: Search functionality now works correctly with database queries

### 🔧 **Enhanced Client-Side Filtering**

- **Problem**: Mobile filter modal was sending column filters that the API couldn't handle
- **Solution**: Implemented hybrid filtering approach:
  - **Server-side**: Search queries using Supabase
  - **Client-side**: Column-specific filters and sorting
- **Benefits**: Full compatibility with mobile filter modal functionality

### 🔧 **Added Missing Database Fields**

- **Problem**: TypeScript errors due to missing `is_archived` field in database queries
- **Solution**: Updated all `select` queries to include the required field
- **Impact**: Eliminates compilation errors and ensures data integrity

## Animation Details

### Loading Animations

```css
/* Main spinner - dual ring with counter rotation */
.outer-ring: 1.2s linear infinite
.inner-ring: 1.8s reverse linear infinite

/* Loading dots - staggered bounce */
.dot-1: 0s delay
.dot-2: 0.2s delay
.dot-3: 0.4s delay

/* Progress bar - left-to-right shimmer */
.progress-shimmer: 2s infinite linear
```

### Button Animations

```css
/* Hover effects */
transform: scale(1.05)
box-shadow: enhanced with color/25 opacity

/* Icon rotation */
.icon: rotate(90deg) on hover

/* Shimmer background */
.shimmer: translateX animation with skew
```

### Card Animations

```css
/* Fade in with stagger */
.card-enter: 0.4s ease-out
.delay: (index % 10) * 50ms

/* Skeleton shimmer */
.skeleton-overlay: gradient shimmer effect
```

## Performance Considerations

1. **Batch Loading**: Loads 10 items at a time to balance performance and UX
2. **Memory Management**: Efficiently handles large datasets
3. **Network Optimization**: Includes 500ms delay to prevent rapid API calls
4. **Animation Performance**: Uses CSS transforms and opacity for smooth animations

## Integration with Categories Page

The component is integrated into the Categories admin page (`/src/admin/pages/Categories.tsx`) and replaces the traditional mobile cards view. It automatically handles:

- Mobile-specific filtering from the filter modal
- Search query synchronization
- Theme integration
- Error state management

## Customization

### Styling

The component uses the theme system and can be customized through:

- Theme classes for colors and backgrounds
- CSS custom properties for animations
- Tailwind utility classes for spacing and layout

### Pagination Settings

```tsx
const PAGE_SIZE = 10; // Adjust items per page
const NETWORK_DELAY = 500; // Simulate network delay (ms)
```

### Animation Timing

```tsx
const ANIMATION_DELAY_OFFSET = 50; // Stagger delay between items (ms)
const SCROLL_DELAY = 100; // Delay before scrolling to new items (ms)
```

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ CSS animations and transforms
- ✅ Smooth scrolling support

## Accessibility

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Focus management for buttons
- **Loading States**: Clear indication of loading progress
- **Error Handling**: Accessible error messages

---

_This component enhances the user experience with professional loading states and smooth pagination, making category management more efficient and visually appealing._
