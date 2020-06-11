import { createAction } from '@ngrx/store';

import { ProductLinks } from 'ish-core/models/product-links/product-links.model';
import { Product, ProductCompletenessLevel, SkuQuantityType } from 'ish-core/models/product/product.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadProduct = createAction('[Shopping] Load Product', payload<{ sku: string }>());

export const loadProductFail = createAction('[Shopping] Load Product Fail', httpError<{ sku: string }>());

export const loadProductIfNotLoaded = createAction(
  '[Shopping] Load Product if not Loaded',
  payload<{ sku: string; level: ProductCompletenessLevel }>()
);

export const loadProductSuccess = createAction('[Shopping] Load Product Success', payload<{ product: Product }>());

export const loadProductsForCategory = createAction(
  '[Shopping] Load Products for Category',
  payload<{ categoryId: string; page?: number; sorting?: string }>()
);

export const loadProductsForCategoryFail = createAction(
  '[Shopping] Load Products for Category Fail',
  httpError<{ categoryId: string }>()
);

export const loadProductVariations = createAction('[Shopping] Load Product Variations', payload<{ sku: string }>());

export const loadProductVariationsFail = createAction(
  '[Shopping] Load Product Variations Fail',
  httpError<{ sku: string }>()
);

export const loadProductVariationsSuccess = createAction(
  '[Shopping] Load Product Variations Success',
  payload<{ sku: string; variations: string[]; defaultVariation: string }>()
);

export const loadProductBundlesSuccess = createAction(
  '[Shopping] Load Product Bundles Success',
  payload<{ sku: string; bundledProducts: SkuQuantityType[] }>()
);

export const loadRetailSetSuccess = createAction(
  '[Shopping] Load Retail Set Success',
  payload<{ sku: string; parts: string[] }>()
);

export const loadProductLinks = createAction('[Shopping] Load Product Links', payload<{ sku: string }>());

export const loadProductLinksFail = createAction('[Shopping] Load Product Links Fail', httpError<{ sku: string }>());

export const loadProductLinksSuccess = createAction(
  '[Shopping] Load Product Links Success',
  payload<{ sku: string; links: ProductLinks }>()
);
