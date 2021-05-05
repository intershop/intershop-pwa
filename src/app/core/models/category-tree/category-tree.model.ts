import { Category } from 'ish-core/models/category/category.model';

export interface CategoryTree {
  nodes: { [id: string]: Category };
  rootIds: string[];
  edges: { [id: string]: string[] };
  categoryRefs: { [categoryRef: string]: string };
}

export * from './category-tree.helper';
