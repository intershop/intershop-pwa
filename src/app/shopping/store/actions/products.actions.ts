import { Action } from '@ngrx/store';
import { Product } from '../../../models/product/product.model';


// load product
export const LOAD_PRODUCT = '[Shopping] Load Product';
export const LOAD_PRODUCT_FAIL = '[Shopping] Load Product Fail';
export const LOAD_PRODUCT_SUCCESS = '[Shopping] Load Product Success';

export class LoadProduct implements Action {
  readonly type = LOAD_PRODUCT;
  constructor(public payload: string) { }
}

export class LoadProductFail implements Action {
  readonly type = LOAD_PRODUCT_FAIL;
  constructor(public payload: any) { }
}

export class LoadProductSuccess implements Action {
  readonly type = LOAD_PRODUCT_SUCCESS;
  constructor(public payload: Product) { }
}

export type ProductsActions =
  LoadProduct |
  LoadProductFail |
  LoadProductSuccess;
