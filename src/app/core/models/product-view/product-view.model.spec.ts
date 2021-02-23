import { Category } from 'ish-core/models/category/category.model';
import { Product } from 'ish-core/models/product/product.model';

import { createProductView } from './product-view.model';

describe('Product View Model', () => {
  it('should return undefined on falsy input', () => {
    expect(createProductView(undefined)).toBeUndefined();
  });

  it('should return product without defaultCategory() if the product default category is not in the category tree', () => {
    const view = createProductView({ defaultCategoryId: 'some' } as Product);
    expect(view).toBeTruthy();
    expect(view.defaultCategory).toBeUndefined();
  });

  it('should return product if the product default category is empty', () => {
    const view = createProductView({ sku: 'some' } as Product);
    expect(view).toBeTruthy();
    expect(view).toHaveProperty('sku', 'some');
  });

  it('should return a view for the default category with all data', () => {
    const category = {
      uniqueId: '123',
      name: 'test',
      categoryPath: ['123'],
    } as Category;

    const view = createProductView({ sku: 'some', defaultCategoryId: '123' } as Product, category);

    expect(view).toBeTruthy();
    expect(view.sku).toEqual('some');
    expect(view.defaultCategory).toHaveProperty('uniqueId', '123');
    expect(view.defaultCategory).toHaveProperty('name', 'test');
  });
});
