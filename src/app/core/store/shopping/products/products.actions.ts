import { createAction } from '@ngrx/store';

import { ProductLinksDictionary } from 'ish-core/models/product-links/product-links.model';
import { AllProductTypes, ProductCompletenessLevel, SkuQuantityType } from 'ish-core/models/product/product.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadProduct = createAction('[Products Internal] Load Product', payload<{ sku: string }>());

export const loadProductFail = createAction('[Products API] Load Product Fail', httpError<{ sku: string }>());

export const loadProductIfNotLoaded = createAction(
  '[Products Internal] Load Product if not Loaded',
  payload<{ sku: string; level: ProductCompletenessLevel }>()
);

export const loadProductSuccess = createAction(
  '[Products API] Load Product Success',
  payload<{ product: Partial<AllProductTypes> }>()
);

export const loadProductsForCategory = createAction(
  '[Products Internal] Load Products for Category',
  payload<{ categoryId: string; page?: number; sorting?: string }>()
);

export const loadProductsForCategoryFail = createAction(
  '[Products API] Load Products for Category Fail',
  httpError<{ categoryId: string }>()
);

export const loadProductsForMaster = createAction(
  '[Products Internal] Load Products for Master',
  payload<{ masterSKU: string; page?: number; sorting?: string }>()
);

export const loadProductsForMasterFail = createAction(
  '[Products API] Load Products for Master Fail',
  httpError<{ masterSKU: string }>()
);

export const loadProductVariationsIfNotLoaded = createAction(
  '[Products Internal] Load Product Variations if not loaded',
  payload<{ sku: string }>()
);

export const loadProductVariationsFail = createAction(
  '[Products API] Load Product Variations Fail',
  httpError<{ sku: string }>()
);

export const loadProductVariationsSuccess = createAction(
  '[Products API] Load Product Variations Success',
  payload<{ sku: string; variations: string[]; defaultVariation: string }>()
);

export const loadProductParts = createAction('[Products API] Load Product Parts', payload<{ sku: string }>());

export const loadProductPartsSuccess = createAction(
  '[Products API] Load Product Parts Success',
  payload<{ sku: string; parts: SkuQuantityType[] }>()
);

export const loadProductLinks = createAction('[Products Internal] Load Product Links', payload<{ sku: string }>());

export const loadProductLinksFail = createAction(
  '[Products API] Load Product Links Fail',
  httpError<{ sku: string }>()
);

export const loadProductLinksSuccess = createAction(
  '[Products API] Load Product Links Success',
  payload<{ sku: string; links: ProductLinksDictionary }>()
);

export const productSpecialUpdate = createAction(
  '[Products Internal] Special Product Update',
  payload<{ sku: string; update: unknown }>()
);
