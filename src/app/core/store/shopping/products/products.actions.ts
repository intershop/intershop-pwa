import { Action } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ProductLinks } from 'ish-core/models/product-links/product-links.model';
import { Product, ProductCompletenessLevel, SkuQuantityType } from 'ish-core/models/product/product.model';

export enum ProductsActionTypes {
  LoadProduct = '[Shopping] Load Product',
  LoadProductBundlesSuccess = '[Shopping] Load Product Bundles Success',
  LoadProductFail = '[Shopping] Load Product Fail',
  LoadProductIfNotLoaded = '[Shopping] Load Product if not Loaded',
  LoadProductSuccess = '[Shopping] Load Product Success',
  LoadProductsForCategory = '[Shopping] Load Products for Category',
  LoadProductsForCategoryFail = '[Shopping] Load Products for Category Fail',
  LoadProductVariations = '[Shopping] Load Product Variations',
  LoadProductVariationsFail = '[Shopping] Load Product Variations Fail',
  LoadProductVariationsSuccess = '[Shopping] Load Product Variations Success',
  LoadRetailSetSuccess = '[Shopping] Load Retail Set Success',
  LoadProductLinks = '[Shopping] Load Product Links',
  LoadProductLinksFail = '[Shopping] Load Product Links Fail',
  LoadProductLinksSuccess = '[Shopping] Load Product Links Success',
}

export class LoadProduct implements Action {
  readonly type = ProductsActionTypes.LoadProduct;
  constructor(public payload: { sku: string }) {}
}

export class LoadProductFail implements Action {
  readonly type = ProductsActionTypes.LoadProductFail;
  constructor(public payload: { error: HttpError; sku: string }) {}
}

export class LoadProductIfNotLoaded implements Action {
  readonly type = ProductsActionTypes.LoadProductIfNotLoaded;
  constructor(public payload: { sku: string; level: ProductCompletenessLevel }) {}
}

export class LoadProductSuccess implements Action {
  readonly type = ProductsActionTypes.LoadProductSuccess;
  constructor(public payload: { product: Product }) {}
}

export class LoadProductsForCategory implements Action {
  readonly type = ProductsActionTypes.LoadProductsForCategory;
  constructor(public payload: { categoryId: string; page?: number; sorting?: string }) {}
}

export class LoadProductsForCategoryFail implements Action {
  readonly type = ProductsActionTypes.LoadProductsForCategoryFail;
  constructor(public payload: { error: HttpError; categoryId: string }) {}
}

export class LoadProductVariations implements Action {
  readonly type = ProductsActionTypes.LoadProductVariations;
  constructor(public payload: { sku: string }) {}
}

export class LoadProductVariationsFail implements Action {
  readonly type = ProductsActionTypes.LoadProductVariationsFail;
  constructor(public payload: { error: HttpError; sku: string }) {}
}

export class LoadProductVariationsSuccess implements Action {
  readonly type = ProductsActionTypes.LoadProductVariationsSuccess;
  constructor(public payload: { sku: string; variations: string[]; defaultVariation: string }) {}
}

export class LoadProductBundlesSuccess implements Action {
  readonly type = ProductsActionTypes.LoadProductBundlesSuccess;
  constructor(public payload: { sku: string; bundledProducts: SkuQuantityType[] }) {}
}

export class LoadRetailSetSuccess implements Action {
  readonly type = ProductsActionTypes.LoadRetailSetSuccess;
  constructor(public payload: { sku: string; parts: string[] }) {}
}

export class LoadProductLinks implements Action {
  readonly type = ProductsActionTypes.LoadProductLinks;
  constructor(public payload: { sku: string }) {}
}

export class LoadProductLinksFail implements Action {
  readonly type = ProductsActionTypes.LoadProductLinksFail;
  constructor(public payload: { error: HttpError; sku: string }) {}
}

export class LoadProductLinksSuccess implements Action {
  readonly type = ProductsActionTypes.LoadProductLinksSuccess;
  constructor(public payload: { sku: string; links: ProductLinks }) {}
}

export type ProductsAction =
  | LoadProduct
  | LoadProductBundlesSuccess
  | LoadProductFail
  | LoadProductIfNotLoaded
  | LoadProductSuccess
  | LoadProductsForCategory
  | LoadProductsForCategoryFail
  | LoadProductVariations
  | LoadProductVariationsFail
  | LoadProductVariationsSuccess
  | LoadRetailSetSuccess
  | LoadProductLinks
  | LoadProductLinksFail
  | LoadProductLinksSuccess;
