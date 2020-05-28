import { TestBed } from '@angular/core/testing';

import { OrderTemplateData } from './order-template.interface';
import { OrderTemplateMapper } from './order-template.mapper';
import { OrderTemplate } from './order-template.model';

describe('Order Template Mapper', () => {
  let orderTemplateMapper: OrderTemplateMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
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
});
