import { TestBed } from '@angular/core/testing';

import { WishlistData, WishlistListElementData } from './wishlist.interface';
import { WishlistMapper } from './wishlist.mapper';
import { Wishlist } from './wishlist.model';

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
        preferred: true,
        public: true,
        shared: false,
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

  describe('fromListData', () => {
    it('should return an empty array when input is falsy', () => {
      expect(wishlistMapper.fromListData(undefined)).toBeEmpty();
    });

    it('should map incoming list data to wishlist model data without items', () => {
      const wishlistsData: WishlistListElementData[] = [
        {
          itemId: '1234',
          title: 'wishlist title',
          attributes: [
            { name: 'itemsCount', value: 3 },
            { name: 'preferred', value: true },
            { name: 'public', value: false },
            { name: 'shared', value: true },
          ],
        },
      ];

      const mapped = wishlistMapper.fromListData(wishlistsData);

      expect(mapped).toHaveLength(1);
      expect(mapped[0]).toHaveProperty('id', '1234');
      expect(mapped[0]).toHaveProperty('title', 'wishlist title');
      expect(mapped[0]).toHaveProperty('itemsCount', 3);
      expect(mapped[0]).toHaveProperty('preferred', true);
      expect(mapped[0]).toHaveProperty('public', false);
      expect(mapped[0]).toHaveProperty('shared', true);
      // list data does not contain the items, they are loaded on demand
      expect(mapped[0]).not.toHaveProperty('items');
    });
  });

  describe('fromUpdate', () => {
    it('should map incoming data to wishlist', () => {
      const wishlistId = '1234';

      const updateWishlistData: Wishlist = {
        id: wishlistId,
        title: 'title',
        preferred: true,
        public: false,
      };
      const mapped = wishlistMapper.fromUpdate(updateWishlistData, wishlistId);

      expect(mapped).toHaveProperty('id', wishlistId);
      expect(mapped).toHaveProperty('title', 'title');
      expect(mapped).toHaveProperty('preferred', true);
      expect(mapped).toHaveProperty('public', false);
    });
  });
});
