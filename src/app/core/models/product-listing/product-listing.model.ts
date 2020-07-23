import { URLFormParams } from 'ish-core/utils/url-form-params';

export interface ProductListingID {
  type: string;
  value: string;
  sorting?: string;
  filters?: URLFormParams;
  page?: number;
}

export interface ProductListingType {
  id: ProductListingID;
  itemCount?: number;
  sortKeys?: string[];
  [page: number]: string[];
  pages?: number[];
}

export interface ProductListingView {
  itemCount: number;
  sortKeys: string[];
  lastPage: number;
  products(): string[];
  productsOfPage(page: number): string[];
  nextPage(): number;
  previousPage(): number;
  pageIndices(currentPage?: number): { value: number; display: string }[];
  allPagesAvailable(): boolean;
  empty(): boolean;
}
