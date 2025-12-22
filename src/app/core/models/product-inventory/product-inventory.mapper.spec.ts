import { ProductInventoryMapper } from './product-inventory.mapper';

describe('Product Inventory Mapper', () => {
  describe('fromData', () => {
    it('should map product inventory data to client object', () => {
      expect(
        ProductInventoryMapper.fromData({
          sku: 'abc',
          inStock: true,
          stockLevel: { value: 100 },
          availableStock: 50,
          availability: true,
          availabilityMessage: 'Available now',
        })
      ).toMatchInlineSnapshot(`
        {
          "availability": true,
          "availabilityMessage": "Available now",
          "availableStock": 100,
          "inStock": true,
          "sku": "abc",
        }
      `);
    });

    it('should fallback to availableStock when stockLevel is not provided', () => {
      expect(
        ProductInventoryMapper.fromData({
          sku: 'abc',
          inStock: false,
          availableStock: 25,
          availability: false,
          availabilityMessage: 'Out of stock',
        })
      ).toMatchInlineSnapshot(`
        {
          "availability": false,
          "availabilityMessage": "Out of stock",
          "availableStock": 25,
          "inStock": false,
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
          "availability": undefined,
          "availabilityMessage": undefined,
          "availableStock": undefined,
          "inStock": true,
          "sku": "xyz",
        }
      `);
    });
  });
});
