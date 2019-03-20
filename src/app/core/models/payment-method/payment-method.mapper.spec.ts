import { PaymentMethodData } from './payment-method.interface';
import { PaymentMethodMapper } from './payment-method.mapper';

describe('Payment Method Mapper', () => {
  describe('fromData', () => {
    const paymentMethodData = {
      id: 'ISH_INVOICE',
      displayName: 'Invoice',
      paymentCosts: {
        net: {
          value: 40.34,
          currency: 'USD',
        },
      },
      paymentCostsThreshold: {
        net: {
          value: 40.34,
          currency: 'USD',
        },
      },
      restricted: false,
    } as PaymentMethodData;

    it(`should return PaymentMethod when getting a PaymentMethodData`, () => {
      const paymentMethod = PaymentMethodMapper.fromData(paymentMethodData);

      expect(paymentMethod).toBeTruthy();
      expect(paymentMethod.id).toEqual('ISH_INVOICE');
      expect(paymentMethod.paymentCosts.value).toBePositive();
      expect(paymentMethod.paymentCostsThreshold.value).toBePositive();
      expect(paymentMethod.isRestricted).toBeFalse();
    });

    it(`should return a restricted PaymentMethod when getting restricted PaymentMethodData`, () => {
      paymentMethodData.restricted = true;
      paymentMethodData.restrictions = [
        {
          message: 'restricition message',
          code: 'restricition code',
        },
      ];
      const paymentMethod = PaymentMethodMapper.fromData(paymentMethodData);
      expect(paymentMethod.isRestricted).toBeTrue();
      expect(paymentMethod.restrictionCauses).toHaveLength(1);
    });
  });
});
