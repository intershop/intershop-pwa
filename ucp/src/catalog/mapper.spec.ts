import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { IcmProductData } from '../icm/icm.types';

import { IcmVariation, ToUcpProductContext, toUcpMasterProduct, toUcpProduct } from './mapper';

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
    assert.equal(result.url, 'https://shop.example.com/prd12345');
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

  it('spans the variation range for a master product (min .. max)', () => {
    const master: IcmProductData = {
      sku: '201807231',
      productName: 'Surface Book 2',
      productTypes: ['VARIATION_MASTER'],
      productMaster: true,
      salePrice: { value: 2499, currency: 'USD' },
      minSalePrice: { value: 1999, currency: 'USD' },
      maxSalePrice: { value: 3299, currency: 'USD' },
      minListPrice: { value: 1999, currency: 'USD' },
      maxListPrice: { value: 3299, currency: 'USD' },
    };

    const result = toUcpProduct(master, context);

    assert.deepEqual(result.price_range, {
      min: { amount: 199900, currency: 'USD' },
      max: { amount: 329900, currency: 'USD' },
    });
    // The single variant advertises the "from" (minimum) price.
    assert.deepEqual(result.variants[0].price, { amount: 199900, currency: 'USD' });
  });

  it('spans cheapest part .. summed total for a retail set', () => {
    const set: IcmProductData = {
      sku: '201807198',
      productName: 'Surface Pro Set',
      productTypes: ['RETAIL_SET'],
      retailSet: true,
      minSalePrice: { value: 79.99, currency: 'USD' },
      summedUpSalePrice: { value: 1638.97, currency: 'USD' },
      minListPrice: { value: 79.99, currency: 'USD' },
      summedUpListPrice: { value: 1638.97, currency: 'USD' },
    };

    const result = toUcpProduct(set, context);

    assert.deepEqual(result.price_range, {
      min: { amount: 7999, currency: 'USD' },
      max: { amount: 163897, currency: 'USD' },
    });
    // The single variant advertises the price of the whole set.
    assert.deepEqual(result.variants[0].price, { amount: 163897, currency: 'USD' });
  });
});

describe('toUcpMasterProduct', () => {
  const master: IcmProductData = {
    sku: '201807231',
    productName: 'Surface Book 2',
    productMaster: true,
    productTypes: ['VARIATION_MASTER'],
    manufacturer: 'Microsoft',
    minSalePrice: { value: 1999, currency: 'USD' },
    maxSalePrice: { value: 3299, currency: 'USD' },
  };

  const variations: IcmVariation[] = [
    {
      product: {
        sku: '201807231-01',
        productName: 'Surface Book 2',
        salePrice: { value: 1999, currency: 'USD' },
        inStock: true,
      },
      attributeValues: [
        { name: 'Hard drive size', value: '256GB', variationAttributeId: 'Hard_disk_drive_capacity' },
        { name: 'Display Size', value: '13.5"', variationAttributeId: 'attr_displaysize' },
      ],
    },
    {
      product: {
        sku: '201807231-06',
        productName: 'Surface Book 2',
        salePrice: { value: 3299, currency: 'USD' },
        inStock: true,
      },
      attributeValues: [
        { name: 'Hard drive size', value: '1TB', variationAttributeId: 'Hard_disk_drive_capacity' },
        { name: 'Display Size', value: '15"', variationAttributeId: 'attr_displaysize' },
      ],
    },
  ];

  it('emits one variant per variation with its selected options', () => {
    const result = toUcpMasterProduct(master, variations, context);

    assert.equal(result.id, '201807231');
    assert.equal(result.url, 'https://shop.example.com/prd201807231');
    assert.equal(result.variants.length, 2);
    assert.deepEqual(result.variants[0].price, { amount: 199900, currency: 'USD' });
    assert.deepEqual(result.variants[0].options, [
      { name: 'Hard drive size', label: '256GB' },
      { name: 'Display Size', label: '13.5"' },
    ]);
    assert.equal(result.variants[0].title, '256GB, 13.5"');
  });

  it('spans the full variation price range on the product', () => {
    const result = toUcpMasterProduct(master, variations, context);

    assert.deepEqual(result.price_range, {
      min: { amount: 199900, currency: 'USD' },
      max: { amount: 329900, currency: 'USD' },
    });
  });

  it('aggregates distinct option dimensions and values across variations', () => {
    const result = toUcpMasterProduct(master, variations, context);

    assert.deepEqual(result.options, [
      { name: 'Hard drive size', values: [{ label: '256GB' }, { label: '1TB' }] },
      { name: 'Display Size', values: [{ label: '13.5"' }, { label: '15"' }] },
    ]);
  });

  it('correlates an exact variant lookup via inputs', () => {
    const result = toUcpMasterProduct(master, variations, {
      ...context,
      input: { id: '201807231-06', match: 'exact' },
    });

    assert.equal(result.variants[0].inputs, undefined);
    assert.deepEqual(result.variants[1].inputs, [{ id: '201807231-06', match: 'exact' }]);
  });

  it('marks the featured variant when the lookup id is the master', () => {
    const result = toUcpMasterProduct(master, variations, { ...context, input: { id: '201807231', match: 'exact' } });

    assert.deepEqual(result.variants[0].inputs, [{ id: '201807231', match: 'featured' }]);
  });

  it('features the default variation first regardless of list order', () => {
    const withDefault: IcmVariation[] = [variations[0], { ...variations[1], isDefault: true }];

    const featured = toUcpMasterProduct(master, withDefault, context);
    assert.equal(featured.variants[0].sku, '201807231-06');
    // Product-level option values keep their natural order, not the featured-first order.
    assert.deepEqual(featured.options?.[1].values, [{ label: '13.5"' }, { label: '15"' }]);
  });

  it('represents a search hit as a single purchasable variant with the master range', () => {
    const featured: IcmVariation = {
      product: {
        sku: '201807231-04',
        productName: 'Surface Book 2',
        salePrice: { value: 2499, currency: 'USD' },
        inStock: true,
      },
      attributeValues: [],
      isDefault: true,
    };

    const result = toUcpMasterProduct(master, [featured], context);

    assert.equal(result.id, '201807231');
    assert.equal(result.variants.length, 1);
    // The featured variant is a real, purchasable variation SKU, not the master.
    assert.equal(result.variants[0].sku, '201807231-04');
    assert.deepEqual(result.variants[0].price, { amount: 249900, currency: 'USD' });
    // The "from" range still comes from the master, decoupled from the featured price.
    assert.deepEqual(result.price_range, {
      min: { amount: 199900, currency: 'USD' },
      max: { amount: 329900, currency: 'USD' },
    });
    assert.equal(result.options, undefined);
  });
  // Full 2x2 grid (Hard drive size x Display Size) with one out-of-stock combo, for detail tests.
  const gridVariation = (sku: string, hd: string, display: string, inStock: boolean): IcmVariation => ({
    product: { sku, productName: 'Surface Book 2', salePrice: { value: 2000, currency: 'USD' }, inStock },
    attributeValues: [
      { name: 'Hard drive size', value: hd, variationAttributeId: 'Hard_disk_drive_capacity' },
      { name: 'Display Size', value: display, variationAttributeId: 'attr_displaysize' },
    ],
    isDefault: hd === '256GB' && display === '13.5"',
  });
  const grid: IcmVariation[] = [
    gridVariation('sb-256-135', '256GB', '13.5"', true),
    gridVariation('sb-256-150', '256GB', '15"', true),
    gridVariation('sb-512-135', '512GB', '13.5"', false),
    gridVariation('sb-512-150', '512GB', '15"', true),
  ];

  it('emits selected and availability relative to the default featured variant', () => {
    const result = toUcpMasterProduct(master, grid, { ...context, detail: true });

    // No selection -> featured is the default variation.
    assert.deepEqual(result.selected, [
      { name: 'Hard drive size', label: '256GB' },
      { name: 'Display Size', label: '13.5"' },
    ]);
    // Hard drive size availability with Display held at the featured value (13.5"):
    // 512GB/13.5" exists but is out of stock.
    assert.deepEqual(result.options?.[0], {
      name: 'Hard drive size',
      values: [
        { label: '256GB', exists: true, available: true },
        { label: '512GB', exists: true, available: false },
      ],
    });
  });

  it('narrows the featured variant to an exact selection', () => {
    const result = toUcpMasterProduct(master, grid, {
      ...context,
      detail: true,
      selected: [
        { name: 'Hard drive size', label: '512GB' },
        { name: 'Display Size', label: '15"' },
      ],
    });

    assert.equal(result.variants[0].sku, 'sb-512-150');
    assert.deepEqual(result.selected, [
      { name: 'Hard drive size', label: '512GB' },
      { name: 'Display Size', label: '15"' },
    ]);
  });

  it('relaxes the lowest-priority option when no exact variant matches', () => {
    const result = toUcpMasterProduct(master, grid, {
      ...context,
      detail: true,
      // No 512GB/17" variant exists; keep Hard drive size, relax Display Size first.
      selected: [
        { name: 'Hard drive size', label: '512GB' },
        { name: 'Display Size', label: '17"' },
      ],
      preferences: ['Hard drive size', 'Display Size'],
    });

    // Falls back to a 512GB variant (Display relaxed).
    assert.equal(result.selected?.[0].label, '512GB');
  });

  it('omits selected and availability signals outside detail mode', () => {
    const result = toUcpMasterProduct(master, variations, context);

    assert.equal(result.selected, undefined);
    assert.deepEqual(result.options?.[0].values, [{ label: '256GB' }, { label: '1TB' }]);
  });
});
