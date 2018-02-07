import { CategoriesEffects } from './categories.effects';
import { CompareListEffects } from './compare-list.effects';
import { ProductsEffects } from './products.effects';

export const effects: any[] = [CategoriesEffects, ProductsEffects, CompareListEffects];

export * from './categories.effects';
export * from './products.effects';
export * from './compare-list.effects';
