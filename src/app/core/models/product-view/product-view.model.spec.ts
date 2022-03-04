import { Category } from 'ish-core/models/category/category.model';
import { ProductPriceDetails } from 'ish-core/models/product-prices/product-prices.model';
import { Product } from 'ish-core/models/product/product.model';

import { createProductView } from './product-view.model';

describe('Product View Model', () => {
  it('should return undefined on falsy input', () => {
    expect(createProductView(undefined, undefined, undefined)).toBeUndefined();
  });

  it('should return product without defaultCategory() if the product default category is not in the category tree', () => {
    const view = createProductView({ defaultCategoryId: 'some' } as Product, undefined, undefined);
    expect(view).toBeTruthy();
    expect(view.defaultCategory).toBeUndefined();
  });

  it('should return product if the product default category is empty', () => {
    const view = createProductView({ sku: 'some' } as Product, undefined, undefined);
    expect(view).toBeTruthy();
    expect(view).toHaveProperty('sku', 'some');
  });

  it('should return a view for the default category with all data', () => {
    const category = {
      uniqueId: '123',
      name: 'test',
      categoryPath: ['123'],
    } as Category;

    const productPrice = { sku: 'some', prices: { salePrice: { gross: 1, currency: 'EUR' } } } as ProductPriceDetails;
    const productPriceType = 'gross';

    const view = createProductView(
      { sku: 'some', defaultCategoryId: '123' } as Product,
      productPrice,
      productPriceType,
      category
    );

    expect(view).toBeTruthy();
    expect(view.sku).toEqual('some');
    expect(view.defaultCategory).toHaveProperty('uniqueId', '123');
    expect(view.defaultCategory).toHaveProperty('name', 'test');
    expect(view.salePrice).toMatchInlineSnapshot(`
      Object {
        "currency": "EUR",
        "type": "Money",
        "value": 1,
      }
    `);
  });
});
