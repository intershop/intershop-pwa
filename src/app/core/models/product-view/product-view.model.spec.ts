import { Category } from 'ish-core/models/category/category.model';
import { Product } from 'ish-core/models/product/product.model';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import { createProductView } from './product-view.model';

describe('Product View Model', () => {
  it('should return undefined on falsy input', () => {
    const empty = categoryTree();
    expect(createProductView(undefined, empty)).toBeUndefined();
    expect(createProductView(undefined, undefined)).toBeUndefined();
  });

  it('should return product without defaultCategory() if the product default category is not in the category tree', () => {
    const empty = categoryTree();
    const view = createProductView({ defaultCategoryId: 'some' } as Product, empty);
    expect(view).toBeTruthy();
    expect(view.defaultCategory).toBeUndefined();
  });

  it('should return product if the product default category is empty', () => {
    const empty = categoryTree();
    const view = createProductView({ sku: 'some' } as Product, empty);
    expect(view).toBeTruthy();
    expect(view).toHaveProperty('sku', 'some');
  });

  it('should return a view for the default category with all data', () => {
    const tree = categoryTree([
      {
        uniqueId: '123',
        name: 'test',
        categoryPath: ['123'],
      } as Category,
    ]);
    const view = createProductView({ sku: 'some', defaultCategoryId: '123' } as Product, tree);

    expect(view).toBeTruthy();
    expect(view.sku).toEqual('some');
    expect(view.defaultCategory).toHaveProperty('uniqueId', '123');
    expect(view.defaultCategory).toHaveProperty('name', 'test');
  });
});
