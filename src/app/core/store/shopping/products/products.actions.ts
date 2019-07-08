import { Action } from '@ngrx/store';

import { HttpError } from '../../../models/http-error/http-error.model';
import { Product, ProductCompletenessLevel } from '../../../models/product/product.model';

export enum ProductsActionTypes {
  SelectProduct = '[Shopping] Select Product',
  LoadProduct = '[Shopping] Load Product',
  LoadProductFail = '[Shopping] Load Product Fail',
  LoadProductIfNotLoaded = '[Shopping] Load Product if not Loaded',
  LoadProductSuccess = '[Shopping] Load Product Success',
  LoadProductsForCategory = '[Shopping] Load Products for Category',
  LoadProductsForCategoryFail = '[Shopping] Load Products for Category Fail',
  LoadMoreProductsForCategory = '[Shopping] Load More Products',
  LoadProductVariations = '[Shopping] Load Product Variations',
  LoadProductVariationsFail = '[Shopping] Load Product Variations Fail',
  LoadProductVariationsSuccess = '[Shopping] Load Product Variations Success',
}

export class SelectProduct implements Action {
  readonly type = ProductsActionTypes.SelectProduct;
  constructor(public payload: { sku: string }) {}
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
  constructor(public payload: { categoryId: string }) {}
}

export class LoadProductsForCategoryFail implements Action {
  readonly type = ProductsActionTypes.LoadProductsForCategoryFail;
  constructor(public payload: { error: HttpError; categoryId: string }) {}
}

export class LoadMoreProductsForCategory implements Action {
  readonly type = ProductsActionTypes.LoadMoreProductsForCategory;
  constructor(public payload: { categoryId: string }) {}
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
  constructor(public payload: { sku: string; variations: string[] }) {}
}

export type ProductsAction =
  | SelectProduct
  | LoadProduct
  | LoadProductFail
  | LoadProductIfNotLoaded
  | LoadProductSuccess
  | LoadProductsForCategory
  | LoadMoreProductsForCategory
  | LoadProductVariations
  | LoadProductVariationsFail
  | LoadProductVariationsSuccess;
