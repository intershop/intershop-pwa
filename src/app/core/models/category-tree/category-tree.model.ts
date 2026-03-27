import { Category } from 'ish-core/models/category/category.model';

export interface CategoryTree {
  nodes: Record<string, Category>;
  rootIds: string[];
  edges: Record<string, string[]>;
  categoryRefs: Record<string, string>;
}

export * from './category-tree.helper';
