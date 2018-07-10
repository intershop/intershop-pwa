import { Action } from '@ngrx/store';
import { HttpError } from '../../../models/http-error/http-error.model';
import { Product } from '../../../models/product/product.model';

export enum ProductsActionTypes {
  SelectProduct = '[Shopping] Select Product',
  LoadProduct = '[Shopping] Load Product',
  LoadProductFail = '[Shopping] Load Product Fail',
  LoadProductSuccess = '[Shopping] Load Product Success',
  LoadProductsForCategory = '[Shopping] Load Products for Category',
  LoadMoreProductsForCategory = '[Shopping] Load More Products',
  LoadProductsForCategoryAbort = '[Shopping] Abort Load Products for Category',
}

export class SelectProduct implements Action {
  readonly type = ProductsActionTypes.SelectProduct;
  constructor(public payload: string) {}
}
export class LoadProduct implements Action {
  readonly type = ProductsActionTypes.LoadProduct;
  constructor(public payload: string) {}
}

export class LoadProductFail implements Action {
  readonly type = ProductsActionTypes.LoadProductFail;
  constructor(public payload: HttpError) {}
}

export class LoadProductSuccess implements Action {
  readonly type = ProductsActionTypes.LoadProductSuccess;
  constructor(public payload: Product) {}
}

export class LoadProductsForCategory implements Action {
  readonly type = ProductsActionTypes.LoadProductsForCategory;
  constructor(public payload: string) {}
}

export class LoadMoreProductsForCategory implements Action {
  readonly type = ProductsActionTypes.LoadMoreProductsForCategory;
  constructor(public payload: string) {}
}

export class LoadProductsForCategoryAbort implements Action {
  readonly type = ProductsActionTypes.LoadProductsForCategoryAbort;
}

export type ProductsAction =
  | SelectProduct
  | LoadProduct
  | LoadProductFail
  | LoadProductSuccess
  | LoadProductsForCategory
  | LoadMoreProductsForCategory
  | LoadProductsForCategoryAbort;
