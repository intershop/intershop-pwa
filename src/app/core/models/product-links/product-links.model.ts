export interface ProductLinks {
  products: string[];
  categories: string[];
}

export type ProductLinksDictionary = Record<string, ProductLinks>;
