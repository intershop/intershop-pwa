import { ProductInventoryMapper } from './product-inventory.mapper';

describe('Product Inventory Mapper', () => {
  describe('fromData', () => {
    it('should map product inventory data to client object', () => {
      expect(
        ProductInventoryMapper.fromData({
          sku: 'abc',
          inStock: true,
          availableStock: 50,
        })
      ).toMatchInlineSnapshot(`
        {
          "availableStock": 50,
          "inStock": true,
          "supplierStock": [],
          "sku": "abc",
        }
      `);
    });

    it('should handle undefined data gracefully', () => {
      expect(ProductInventoryMapper.fromData(undefined)).toBeUndefined();
    });

    it('should handle partial data', () => {
      expect(
        ProductInventoryMapper.fromData({
          sku: 'xyz',
          inStock: true,
        })
      ).toMatchInlineSnapshot(`
        {
          "availableStock": undefined,
          "inStock": true,
          "supplierStock": [],
          "sku": "xyz",
        }
      `);
    });
  });
});
