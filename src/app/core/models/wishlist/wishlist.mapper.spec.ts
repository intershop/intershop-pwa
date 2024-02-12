import { TestBed } from '@angular/core/testing';

import { WishlistData } from './wishlist.interface';
import { WishlistMapper } from './wishlist.mapper';

describe('Wishlist Mapper', () => {
  let wishlistMapper: WishlistMapper;

  beforeEach(() => {
    wishlistMapper = TestBed.inject(WishlistMapper);
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => wishlistMapper.fromData(undefined, undefined)).toThrow();
    });

    it('should map incoming data to wishlist model data', () => {
      const wishlistData: WishlistData = {
        title: 'wishlist title',
        itemsCount: 3,
        items: [
          {
            attributes: [
              { name: 'sku', value: '123456' },
              { name: 'id', value: 'wishlistItemId' },
              { name: 'creationDate', value: '12345818123' },
              {
                name: 'desiredQuantity',
                value: {
                  value: 2,
                  unit: '',
                },
              },
            ],
          },
        ],
      };
      const mapped = wishlistMapper.fromData(wishlistData, '1234');
      expect(mapped).toHaveProperty('id', '1234');
      expect(mapped).toHaveProperty('title', 'wishlist title');
      expect(mapped).toHaveProperty('items', [
        { sku: '123456', id: 'wishlistItemId', creationDate: 12345818123, desiredQuantity: { value: 2 } },
      ]);
      expect(mapped).not.toHaveProperty('creationDate');
    });
  });
});
