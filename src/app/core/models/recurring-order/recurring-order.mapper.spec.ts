import { LineItemData } from 'ish-core/models/line-item/line-item.interface';

import { RecurringOrderData } from './recurring-order.interface';
import { RecurringOrderMapper } from './recurring-order.mapper';
import { RecurringOrder } from './recurring-order.model';

describe('Recurring Order Mapper', () => {
  const recurringOrderData = {
    number: '0000045',
    id: 'TEwK8ITr4AQAAAGRGCQADlo0',
    buyer: {
      companyName: 'Oil Corp',
    },
    lineItems: [
      {
        calculated: false,
      } as LineItemData,
    ],
    payments: [{ id: 'payment_1' }],
    paymentMethods: [{ id: 'payment_method_1' }],
  } as RecurringOrderData;

  describe('fromData', () => {
    let recurringOrder: RecurringOrder;

    it(`should return RecurringOrder when getting RecurringOrderData`, () => {
      recurringOrder = RecurringOrderMapper.fromData(recurringOrderData);
      expect(recurringOrder).toBeTruthy();
    });
  });
});
