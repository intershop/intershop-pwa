import { TestBed } from '@angular/core/testing';
import * as using from 'jasmine-data-provider';

import { ProductRoutePipe } from './product-route.pipe';

describe('Product Route Pipe', () => {
  let productRoutePipe: ProductRoutePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductRoutePipe],
    });
    productRoutePipe = TestBed.get(ProductRoutePipe);
  });

  it('should be created', () => {
    expect(productRoutePipe).toBeTruthy();
  });

  function dataProvider() {
    return [
      {
        product: { sku: 'SKU' },
        category: { uniqueId: 'CAT' },
        expected: '/category/CAT/product/SKU',
      },
      { product: { sku: 'SKU' }, category: undefined, expected: '/product/SKU' },
      { product: {}, category: undefined, expected: '/' },
      { product: undefined, category: undefined, expected: '/' },
      {
        product: { sku: 'SKU', name: 'name' },
        category: { uniqueId: 'CAT' },
        expected: '/category/CAT/product/SKU/name',
      },
      { product: { sku: 'SKU', name: 'name' }, category: undefined, expected: '/product/SKU/name' },
      { product: { sku: 'A' }, expected: '/product/A' },
      { product: { sku: 'A', name: '' }, expected: '/product/A' },
      { product: { sku: 'A', name: 'some example name' }, expected: '/product/A/some-example-name' },
      { product: { sku: 'A', name: 'name & speci@l char$' }, expected: '/product/A/name-speci-l-char' },
    ];
  }

  using(dataProvider, dataSlice => {
    it(`should return ${dataSlice.expected} when supplying product '${JSON.stringify(
      dataSlice.product
    )}' and category '${JSON.stringify(dataSlice.category)}'`, () => {
      expect(productRoutePipe.transform(dataSlice.product, dataSlice.category)).toEqual(dataSlice.expected);
    });
  });
});
