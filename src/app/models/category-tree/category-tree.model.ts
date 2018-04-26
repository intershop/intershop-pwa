import { Category } from '../category/category.model';

export interface CategoryTree {
  nodes: { [id: string]: Category };
  rootIds: string[];
  ids: string[];
  edges: { [id: string]: string[] };
}

export * from './category-tree.helper';
