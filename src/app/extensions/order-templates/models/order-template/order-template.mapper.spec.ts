import { TestBed } from '@angular/core/testing';

import { OrderTemplateData, OrderTemplateListElementData } from './order-template.interface';
import { OrderTemplateMapper } from './order-template.mapper';
import { OrderTemplate } from './order-template.model';

describe('Order Template Mapper', () => {
  let orderTemplateMapper: OrderTemplateMapper;

  beforeEach(() => {
    orderTemplateMapper = TestBed.inject(OrderTemplateMapper);
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => orderTemplateMapper.fromData(undefined, undefined)).toThrow();
    });

    it('should map incoming data to order template model data', () => {
      const orderTemplateData: OrderTemplateData = {
        title: 'order template title',
        itemsCount: 3,
        items: [
          {
            attributes: [
              { name: 'sku', value: '123456' },
              { name: 'id', value: 'orderTemplateItemId' },
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
      const mapped = orderTemplateMapper.fromData(orderTemplateData, '1234');
      expect(mapped).toHaveProperty('id', '1234');
      expect(mapped).toHaveProperty('title', 'order template title');
      expect(mapped).toHaveProperty('items', [
        { sku: '123456', id: 'orderTemplateItemId', creationDate: 12345818123, desiredQuantity: { value: 2 } },
      ]);
    });
  });

  describe('fromUpdate', () => {
    it('should map incoming data to order template', () => {
      const orderTeplateId = '1234';

      const updateOrderTeplateData: OrderTemplate = {
        id: orderTeplateId,
        title: 'title',
      };
      const mapped = orderTemplateMapper.fromUpdate(updateOrderTeplateData, orderTeplateId);

      expect(mapped).toHaveProperty('id', orderTeplateId);
      expect(mapped).toHaveProperty('title', 'title');
    });
  });

  describe('fromListData', () => {
    it('should return undefined when input is falsy', () => {
      expect(orderTemplateMapper.fromListData(undefined)).toBeUndefined();
    });

    it('should return empty array when input is empty', () => {
      expect(orderTemplateMapper.fromListData([])).toBeEmpty();
    });

    it('should map list element data to order template array', () => {
      const listData: OrderTemplateListElementData[] = [
        {
          uri: 'any/wishlists/1234',
          title: 'My Template',
          attributes: [
            { name: 'itemsCount', value: 3 },
            { name: 'creationDate', value: 1234567890 },
          ],
        },
        {
          uri: 'any/wishlists/5678',
          title: 'Second Template',
          attributes: [{ name: 'itemsCount', value: 0 }],
        },
      ];

      const mapped = orderTemplateMapper.fromListData(listData);

      expect(mapped).toHaveLength(2);
      expect(mapped[0]).toEqual({
        id: '1234',
        title: 'My Template',
        itemsCount: 3,
        creationDate: 1234567890,
      });
      expect(mapped[1]).toEqual({
        id: '5678',
        title: 'Second Template',
        itemsCount: 0,
        creationDate: undefined,
      });
    });
  });
});
