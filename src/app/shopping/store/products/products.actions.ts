import { Action } from '@ngrx/store';
import { Product } from '../../../models/product/product.model';

export enum ProductsActionTypes {
  LoadProduct = '[Shopping] Load Product',
  LoadProductFail = '[Shopping] Load Product Fail',
  LoadProductSuccess = '[Shopping] Load Product Success',
  LoadProductsForCategory = '[Shopping] Load Products for Category',
}

export class LoadProduct implements Action {
  readonly type = ProductsActionTypes.LoadProduct;
  constructor(public payload: string) { }
}

export class LoadProductFail implements Action {
  readonly type = ProductsActionTypes.LoadProductFail;
  constructor(public payload: any) { }
}

export class LoadProductSuccess implements Action {
  readonly type = ProductsActionTypes.LoadProductSuccess;
  constructor(public payload: Product) { }
}

export class LoadProductsForCategory implements Action {
  readonly type = ProductsActionTypes.LoadProductsForCategory;
  constructor(public payload: string) { }
}

export type ProductsAction =
  | LoadProduct
  | LoadProductFail
  | LoadProductSuccess
  | LoadProductsForCategory;
