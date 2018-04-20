import * as using from 'jasmine-data-provider';
import { CategoryMapper } from '../category/category.mapper';
import { ProductMapper } from './product.mapper';
import { Product, ProductHelper } from './product.model';

describe('Product Helper', () => {
  describe('generateProductRoute()', () => {
    function dataProvider() {
      return [
        {
          product: { sku: 'SKU' },
          category: { id: 'CAT_ID' },
          categoryUniqueId: 'CAT',
          expected: '/category/CAT/product/SKU',
        },
        { product: { sku: 'SKU' }, category: undefined, categoryUniqueId: undefined, expected: '/product/SKU' },
        { product: {}, category: undefined, categoryUniqueId: undefined, expected: '/' },
        { product: undefined, category: undefined, categoryUniqueId: undefined, expected: '/' },
      ];
    }

    using(dataProvider, dataSlice => {
      it(`should return ${dataSlice.expected} when supplying product '${JSON.stringify(
        dataSlice.product
      )}' and category '${JSON.stringify(dataSlice.category)}'`, () => {
        const product = dataSlice.product ? ProductMapper.fromData(dataSlice.product) : undefined;
        const category = dataSlice.category
          ? CategoryMapper.fromData(dataSlice.category, dataSlice.categoryUniqueId)
          : undefined;
        expect(ProductHelper.generateProductRoute(product, category)).toEqual(dataSlice.expected);
      });
    });
  });

  describe('image', () => {
    let product: Product;
    beforeEach(() => {
      product = { sku: 'sku' } as Product;
      product.images = [
        {
          name: 'front S',
          type: 'Image',
          imageActualHeight: 110,
          imageActualWidth: 110,
          viewID: 'front',
          effectiveUrl: '/assets/product_img/a.jpg',
          typeID: 'S',
          primaryImage: true,
        },
        {
          name: 'front S',
          type: 'Image',
          imageActualHeight: 110,
          imageActualWidth: 110,
          viewID: 'front',
          effectiveUrl: '/assets/product_img/a.jpg',
          typeID: 'S',
          primaryImage: false,
        },
        {
          name: 'front L',
          type: 'Image',
          imageActualHeight: 500,
          imageActualWidth: 500,
          viewID: 'front',
          effectiveUrl: '/assets/product_img/a.jpg',
          typeID: 'L',
          primaryImage: true,
        },
        {
          name: 'side L',
          type: 'Image',
          imageActualHeight: 500,
          imageActualWidth: 500,
          viewID: 'side',
          effectiveUrl: '/assets/product_img/b.jpg',
          typeID: 'L',
          primaryImage: false,
        },
      ];
    });

    describe('getPrimaryImage()', () => {
      it('should return primary image when called with image type as L(Large size)', () => {
        expect(ProductHelper.getPrimaryImage(product, 'L').primaryImage).toBeTruthy();
      });

      it('should return undefined  when called with invalid image type', () => {
        expect(ProductHelper.getPrimaryImage(product, 'W')).toBeUndefined();
      });

      it('should return undefined when images are not available', () => {
        product.images = [];
        expect(ProductHelper.getPrimaryImage(product, 'L')).toBeUndefined();
      });

      it('should return undefined when images is not defined', () => {
        product = { sku: 'sku' } as Product;
        expect(ProductHelper.getPrimaryImage(product, 'L')).toBeUndefined();
      });
    });

    describe('getImageByImageTypeAndImageView()', () => {
      it('should return image when called with image type as L(Large size) and image view as front', () => {
        expect(ProductHelper.getImageByImageTypeAndImageView(product, 'L', 'front')).toEqual(product.images[2]);
      });

      it('should return undefined when called with invalid image type and invalid image view', () => {
        expect(ProductHelper.getImageByImageTypeAndImageView(product, 'W', 'left')).toBeUndefined();
      });

      it('should return undefined when images are not available', () => {
        product.images = [];
        expect(ProductHelper.getImageByImageTypeAndImageView(product, 'L', 'front')).toBeUndefined();
      });

      it('should return undefined when images is not defined', () => {
        product = { sku: 'sku' } as Product;
        expect(ProductHelper.getImageByImageTypeAndImageView(product, 'L', 'front')).toBeUndefined();
      });
    });

    describe('getImageViewIDsExcludePrimary()', () => {
      it('should return list of image viewIDs  excluding primary image viewID when called with image type as L(Large size)', () => {
        expect(ProductHelper.getImageViewIDsExcludePrimary(product, 'L').length).toBeGreaterThan(0);
      });

      it('should return empty list when called with invalid image type', () => {
        expect(ProductHelper.getImageViewIDsExcludePrimary(product, 'W').length).toEqual(0);
      });

      it('should return empty list when images are not available', () => {
        product.images = [];
        expect(ProductHelper.getImageViewIDsExcludePrimary(product, 'L').length).toEqual(0);
      });

      it('should return empty list when images is not defined', () => {
        product = { sku: 'sku' } as Product;
        expect(ProductHelper.getImageViewIDsExcludePrimary(product, 'L').length).toEqual(0);
      });
    });
  });

  describe('isMasterProduct()', () => {
    function dataProvider() {
      return [
        { product: {}, expected: false },
        { product: { mastered: true }, expected: false },
        { product: { productMaster: true }, expected: true },
      ];
    }

    using(dataProvider, dataSlice => {
      it(`should return ${dataSlice.expected} when supplying product '${JSON.stringify(dataSlice.product)}'`, () => {
        const product = ProductMapper.fromData(dataSlice.product);
        expect(ProductHelper.isMasterProduct(product)).toEqual(dataSlice.expected);
      });
    });
  });
});
