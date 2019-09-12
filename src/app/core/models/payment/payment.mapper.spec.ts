import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethodBaseData } from 'ish-core/models/payment-method/payment-method.interface';

import { PaymentData } from './payment.interface';
import { PaymentMapper } from './payment.mapper';

describe('Payment Mapper', () => {
  const paymentData = {
    id: '1234',
    redirectRequired: false,
    status: 'unprocessed',
  } as PaymentData;

  const paymentMethodData = {
    id: 'ISH_INVOICE',
    serviceID: 'ISH_INVOICE',
    capabilities: ['RedirectBeforeCheckout'],
    displayName: 'Invoice',
    description: 'Pay with Invoice',
  } as PaymentMethodBaseData;

  const paymentInstrument = {
    id: 'id: "VuMKAM4rw4UAAAFrlvMndOYM"',
    accountIdentifier: '*********643274',
  } as PaymentInstrument;

  describe('fromIncludeData', () => {
    it(`should return Payment when getting complete Payment Include Data`, () => {
      const payment = PaymentMapper.fromIncludeData(paymentData, paymentMethodData, paymentInstrument);

      expect(payment).toBeTruthy();
      expect(payment.capabilities).toHaveLength(1);

      expect(payment.description).toEqual(paymentMethodData.description);
      expect(payment.displayName).toEqual(paymentMethodData.displayName);
      expect(payment.paymentInstrument.id).toEqual(paymentInstrument.id);
      expect(payment.redirectRequired).toEqual(paymentData.redirectRequired);
      expect(payment.status).toEqual(paymentData.status);
    });

    it(`should return Payment when getting Payment Include Data without paymentMethod and paymentInstrument`, () => {
      const payment = PaymentMapper.fromIncludeData(paymentData, undefined, undefined);

      expect(payment).toBeTruthy();
      expect(payment.redirectRequired).toEqual(paymentData.redirectRequired);
      expect(payment.status).toEqual(paymentData.status);
    });
  });
});
