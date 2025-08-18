/**
 * Helper class for mapping Sparque search API types to PWA-supported types.
 *
 * This utility class provides static methods to transform Sparque API response data
 * into formats compatible with the Intershop PWA filter system. It handles the conversion
 * of display types and selection types from Sparque's naming conventions to the PWA's
 * internal filter representation.
 *
 * @example
 * ```typescript
 * // Map Sparque display type to PWA display type
 * const pwaDisplayType = SparqueSearchHelper.mapDisplayType('text'); // Returns 'text_clear'
 *
 * // Map Sparque selection type to PWA selection type
 * const pwaSelectionType = SparqueSearchHelper.mapSelectionType('multiple/and'); // Returns 'single'
 * ```
 */
export class SparqueSearchHelper {
  /**
   * Maps Sparque display type to PWA supported display type.
   *
   * @param sparqueDisplayType - The display type from Sparque API
   * @returns PWA supported display type
   */
  static mapDisplayType(sparqueDisplayType: string): string {
    if (!sparqueDisplayType) {
      return 'text';
    }

    const displayTypeMapping: Record<string, string> = {
      // Sparque types to PWA types
      text: 'text_clear',
      checkbox: 'checkbox',
      dropdown: 'dropdown',
      swatch: 'swatch',
      color: 'swatch',
    };

    return displayTypeMapping[sparqueDisplayType.toLowerCase()] || 'text';
  }

  /**
   * Maps Sparque selection type to PWA supported selection type.
   *
   * @param sparqueSelectionType - The selection type from Sparque API
   * @returns PWA supported selection type
   */
  static mapSelectionType(sparqueSelectionType: string): string {
    if (!sparqueSelectionType) {
      return 'single';
    }

    const selectionTypeMapping: Record<string, string> = {
      // Sparque types to PWA types
      'multiple/and': 'single',
      'multiple/or': 'single',
      single: 'single',
    };

    return selectionTypeMapping[sparqueSelectionType.toLowerCase()] || 'single';
  }
}
