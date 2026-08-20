import { ToUcpProductContext, toUcpProduct } from './catalog.mapper';
import { IcmProductData } from './icm.types';

describe('Catalog Mapper', () => {
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

  it('should map a basic ICM product to a single-variant UCP product', () => {
    const result = toUcpProduct(baseProduct, context);

    expect(result.id).toBe('12345');
    expect(result.title).toBe('Test Product');
    expect(result.description.plain).toBe('A short description');
    expect(result.url).toBe('https://shop.example.com/product/12345');
    expect(result.variants).toHaveLength(1);
    expect(result.variants[0].id).toBe('12345');
    expect(result.variants[0].availability.available).toBeTrue();
  });

  it('should convert prices to integer minor units', () => {
    const result = toUcpProduct(baseProduct, context);

    expect(result.price_range.min).toEqual({ amount: 19999, currency: 'USD' });
  });

  it('should expose a strike-through list price only when it differs from the sale price', () => {
    const discounted = toUcpProduct(
      { ...baseProduct, listPrice: { value: 249.99, currency: 'USD' }, salePrice: { value: 199.99, currency: 'USD' } },
      context
    );
    expect(discounted.variants[0].list_price).toEqual({ amount: 24999, currency: 'USD' });
    expect(discounted.list_price_range).toEqual({
      min: { amount: 24999, currency: 'USD' },
      max: { amount: 24999, currency: 'USD' },
    });

    const noDiscount = toUcpProduct(baseProduct, context);
    expect(noDiscount.variants[0].list_price).toBeUndefined();
    expect(noDiscount.list_price_range).toBeUndefined();
  });

  it('should resolve relative image URLs against the ICM base URL', () => {
    const result = toUcpProduct(baseProduct, context);

    expect(result.media[0]).toEqual({
      type: 'image',
      url: 'https://icm.example.com/img/front.jpg',
      alt_text: 'Test Product',
    });
  });

  it('should keep absolute image URLs unchanged', () => {
    const result = toUcpProduct(
      { ...baseProduct, images: [{ effectiveUrl: 'https://cdn.example.com/x.jpg', primaryImage: true }] },
      context
    );

    expect(result.media[0].url).toBe('https://cdn.example.com/x.jpg');
  });

  it('should add a lookup correlation input when provided', () => {
    const result = toUcpProduct(baseProduct, { ...context, input: { id: '12345', match: 'exact' } });

    expect(result.variants[0].inputs).toEqual([{ id: '12345', match: 'exact' }]);
  });

  it('should degrade gracefully for products without prices or images', () => {
    const result = toUcpProduct({ sku: '999', productName: 'Bare' }, context);

    expect(result.price_range.min).toEqual({ amount: 0, currency: 'USD' });
    expect(result.media).toBeEmpty();
    expect(result.variants[0].availability.available).toBeFalse();
  });
});
