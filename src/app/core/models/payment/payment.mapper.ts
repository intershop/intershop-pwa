import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethodBaseData } from 'ish-core/models/payment-method/payment-method.interface';

import { PaymentData } from './payment.interface';
import { Payment } from './payment.model';

export class PaymentMapper {
  static fromIncludeData(
    paymentData: PaymentData,
    paymentMethodData: PaymentMethodBaseData,
    paymentInstrument: PaymentInstrument
  ): Payment {
    if (!paymentData) {
      throw new Error(`'paymentData' is required`);
    }

    return {
      id: paymentData.id,
      capabilities: paymentMethodData ? paymentMethodData.capabilities : undefined,
      description: paymentMethodData ? paymentMethodData.description : undefined,
      displayName: paymentMethodData ? paymentMethodData.displayName : undefined,
      paymentInstrument: paymentInstrument ? paymentInstrument : { id: paymentData.paymentInstrument },
      redirectUrl: paymentData.redirect ? paymentData.redirect.redirectUrl : undefined,
      redirectRequired: paymentData.redirectRequired,
      status: paymentData.status,
    };
  }
}
