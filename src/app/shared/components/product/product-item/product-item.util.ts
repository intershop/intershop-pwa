const displayTypes = ['tile', 'row'] as const;

export type ProductItemDisplayType = typeof displayTypes[number];

export function checkDisplayType(displayType: string): ProductItemDisplayType {
  if (displayType && !displayTypes.includes(displayType as ProductItemDisplayType)) {
    throw new Error(`Invalid displayType for product-item: ${displayType}`);
  }

  return displayType as ProductItemDisplayType;
}
