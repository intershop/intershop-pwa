import { SparqueCategory } from 'ish-core/models/sparque-category/sparque-category.interface';

export interface SparqueCategoryTreeResponse {
  categories?: SparqueCategory[];
  errors?: SparqueErrorResponse[];
}

interface SparqueErrorResponse {
  // Add error response structure if needed
  [key: string]: unknown;
}
