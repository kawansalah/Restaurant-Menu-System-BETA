# Category Cascade Deletion Feature

## Overview

When deleting a category, the system now automatically deletes all associated subcategories and their images to maintain data integrity and prevent orphaned records.

## Implementation Details

### Single Category Deletion

When a category is deleted using `deleteCategory(id)`:

1. **Fetch Subcategories**: Retrieves all subcategories belonging to the category
2. **Delete Subcategories**: Removes subcategories and their associated images from storage
3. **Delete Category**: Finally removes the category itself

### Bulk Category Deletion

When multiple categories are deleted using `bulkDeleteCategories(categoryIds)`:

1. **Collect Subcategories**: Gathers all subcategories from all categories being deleted
2. **Bulk Delete Subcategories**: Removes all subcategories and their images in a single operation
3. **Delete Categories**: Removes all categories

### Image Cleanup

The system automatically handles image cleanup for subcategories:

- **Main Images**: `image_url` files are removed from Supabase storage
- **Thumbnails**: `thumbnail_url` files are removed from Supabase storage
- **Error Handling**: Gracefully handles missing or invalid image URLs

## Files Modified

### `src/admin/services/categoryService.ts`

- Added import for `fetchSubCategories` and `bulkDeleteSubCategories`
- Modified `deleteCategory()` function to implement cascade deletion
- Modified `bulkDeleteCategories()` function to implement cascade deletion

### Functions Updated

#### `deleteCategory(id: string)`

```typescript
/**
 * Delete a category and all its subcategories (cascade delete)
 */
export const deleteCategory = async (id: string): Promise<{
  success: boolean;
  error?: string;
}>
```

#### `bulkDeleteCategories(categoryIds: string[])`

```typescript
/**
 * Bulk delete categories and all their subcategories (cascade delete)
 */
export const bulkDeleteCategories = async (categoryIds: string[]): Promise<{
  success: boolean;
  error?: string;
}>
```

## Error Handling

The implementation includes comprehensive error handling:

- Validates subcategory fetching before deletion
- Reports specific errors for subcategory deletion failures
- Maintains transactional integrity (if subcategory deletion fails, category deletion is aborted)

## Benefits

1. **Data Integrity**: Prevents orphaned subcategories in the database
2. **Storage Cleanup**: Automatically removes unused image files
3. **User Experience**: Single action removes all related data
4. **Error Prevention**: Reduces potential for database inconsistencies

## Usage

No changes required in the UI components. The existing category deletion functionality now automatically includes cascade deletion:

```typescript
// Single category deletion
await deleteCategory(categoryId);

// Bulk category deletion
await bulkDeleteCategories([categoryId1, categoryId2, categoryId3]);
```

## Testing Recommendations

1. Test single category deletion with subcategories
2. Test bulk category deletion with multiple categories having subcategories
3. Verify image files are removed from storage
4. Test error scenarios (network failures, permission issues)
5. Verify database consistency after operations
