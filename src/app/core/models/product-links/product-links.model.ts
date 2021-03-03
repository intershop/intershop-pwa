export interface ProductLinks {
  products: string[];
  categories: string[];
}

export interface ProductLinksDictionary {
  [id: string]: ProductLinks;
}
