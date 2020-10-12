import { createAction } from '@ngrx/store';

import { ProductLinks } from 'ish-core/models/product-links/product-links.model';
import { Product, ProductCompletenessLevel, SkuQuantityType } from 'ish-core/models/product/product.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadProduct = createAction('[Products Internal] Load Product', payload<{ sku: string }>());

export const loadProductFail = createAction('[Products API] Load Product Fail', httpError<{ sku: string }>());

export const loadProductIfNotLoaded = createAction(
  '[Products Internal] Load Product if not Loaded',
  payload<{ sku: string; level: ProductCompletenessLevel }>()
);

export const loadProductSuccess = createAction('[Products API] Load Product Success', payload<{ product: Product }>());

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

export const loadProductVariations = createAction(
  '[Products Internal] Load Product Variations',
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

export const loadProductBundlesSuccess = createAction(
  '[Products API] Load Product Bundles Success',
  payload<{ sku: string; bundledProducts: SkuQuantityType[] }>()
);

export const loadRetailSetSuccess = createAction(
  '[Products API] Load Retail Set Success',
  payload<{ sku: string; parts: string[] }>()
);

export const loadProductLinks = createAction('[Products Internal] Load Product Links', payload<{ sku: string }>());

export const loadProductLinksFail = createAction(
  '[Products API] Load Product Links Fail',
  httpError<{ sku: string }>()
);

export const loadProductLinksSuccess = createAction(
  '[Products API] Load Product Links Success',
  payload<{ sku: string; links: ProductLinks }>()
);
