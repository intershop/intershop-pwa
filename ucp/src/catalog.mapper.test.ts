import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ToUcpProductContext, toUcpProduct } from './catalog.mapper';
import { IcmProductData } from './icm.types';

const context: ToUcpProductContext = {
  currency: 'USD',
  icmBaseUrl: 'https://icm.example.com',
  storefrontBaseUrl: 'https://shop.example.com',
};

const baseProduct: IcmProductData = {
  sku: '12345',
  productName: 'Test Product',
  shortDescription: 'A short description',
  salePrice: { value: 199.99, currency: 'USD' },
  inStock: true,
  images: [{ effectiveUrl: '/img/front.jpg', primaryImage: true }],
};

describe('Catalog Mapper', () => {
  it('maps a basic ICM product to a single-variant UCP product', () => {
    const result = toUcpProduct(baseProduct, context);

    assert.equal(result.id, '12345');
    assert.equal(result.title, 'Test Product');
    assert.equal(result.description.plain, 'A short description');
    assert.equal(result.url, 'https://shop.example.com/product/12345');
    assert.equal(result.variants.length, 1);
    assert.equal(result.variants[0].id, '12345');
    assert.equal(result.variants[0].availability.available, true);
  });

  it('converts prices to integer minor units', () => {
    const result = toUcpProduct(baseProduct, context);

    assert.deepEqual(result.price_range.min, { amount: 19999, currency: 'USD' });
  });

  it('exposes a strike-through list price only when it differs from the sale price', () => {
    const discounted = toUcpProduct(
      { ...baseProduct, listPrice: { value: 249.99, currency: 'USD' }, salePrice: { value: 199.99, currency: 'USD' } },
      context
    );
    assert.deepEqual(discounted.variants[0].list_price, { amount: 24999, currency: 'USD' });
    assert.deepEqual(discounted.list_price_range, {
      min: { amount: 24999, currency: 'USD' },
      max: { amount: 24999, currency: 'USD' },
    });

    const noDiscount = toUcpProduct(baseProduct, context);
    assert.equal(noDiscount.variants[0].list_price, undefined);
    assert.equal(noDiscount.list_price_range, undefined);
  });

  it('resolves relative image URLs against the ICM base URL', () => {
    const result = toUcpProduct(baseProduct, context);

    assert.deepEqual(result.media[0], {
      type: 'image',
      url: 'https://icm.example.com/img/front.jpg',
      alt_text: 'Test Product',
    });
  });

  it('keeps absolute image URLs unchanged', () => {
    const result = toUcpProduct(
      { ...baseProduct, images: [{ effectiveUrl: 'https://cdn.example.com/x.jpg', primaryImage: true }] },
      context
    );

    assert.equal(result.media[0].url, 'https://cdn.example.com/x.jpg');
  });

  it('adds a lookup correlation input when provided', () => {
    const result = toUcpProduct(baseProduct, { ...context, input: { id: '12345', match: 'exact' } });

    assert.deepEqual(result.variants[0].inputs, [{ id: '12345', match: 'exact' }]);
  });

  it('degrades gracefully for products without prices or images', () => {
    const result = toUcpProduct({ sku: '999', productName: 'Bare' }, context);

    assert.deepEqual(result.price_range.min, { amount: 0, currency: 'USD' });
    assert.deepEqual(result.media, []);
    assert.equal(result.variants[0].availability.available, false);
  });
});
