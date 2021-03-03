import { PaymentInstrumentData } from 'ish-core/models/payment-instrument/payment-instrument.interface';

import {
  PaymentMethodData,
  PaymentMethodOptionsDataType,
  PaymentMethodParameterType,
} from './payment-method.interface';
import { PaymentMethodMapper } from './payment-method.mapper';

describe('Payment Method Mapper', () => {
  describe('fromData', () => {
    const paymentMethodData = {
      data: [
        {
          id: 'ISH_CreditCard',
          serviceID: 'ISH_CreditCard',
          displayName: 'Credit Card',
          paymentCosts: {
            net: {
              value: 40.34,
              currency: 'USD',
            },
            gross: {
              value: 40.34,
              currency: 'USD',
            },
          },
          paymentInstruments: ['12345'],
          paymentCostsThreshold: {
            net: {
              value: 40.34,
              currency: 'USD',
            },
            gross: {
              value: 40.34,
              currency: 'USD',
            },
          },
          saveAllowed: true,
          restricted: false,
        },
      ],
      included: {
        paymentInstruments: { 12345: { id: 'ISH_CreditCard' } },
      },
    } as PaymentMethodData;

    const regexp = '^[A-Z]{2}[0-9]{2}([- ]{0,1}[0-9A-Z]{4}){4}[- 0-9A-Z]{0,4}';
    const parametersData: PaymentMethodParameterType[] = [
      {
        constraints: {
          required: {
            message: 'The name of the account holder is missing.',
          },
        },

        displayName: 'Account Holder',
        hidden: false,
        name: 'holder',
        type: 'string',
      },
      {
        constraints: {
          required: {
            message: 'The IBAN is required.',
          },

          size: {
            min: 15,
            max: 34,
            message: 'The IBAN must have a length of 15 to 34 characters.',
          },

          pattern: {
            regexp,
            message: 'The IBAN structure is invalid.',
          },
        },

        displayName: 'IBAN',
        hidden: false,
        name: 'IBAN',
        type: 'string',
      },
      {
        displayName: 'BIC',
        hidden: false,
        name: 'BIC',
        type: 'string',
      },
      {
        displayName: 'paymentMethodId',
        hidden: true,
        name: 'paymentMethodId',
        type: 'string',
      },
    ];

    it(`should return PaymentMethod when getting a PaymentMethodData`, () => {
      const paymentMethod = PaymentMethodMapper.fromData(paymentMethodData)[0];

      expect(paymentMethod).toBeTruthy();
      expect(paymentMethod.id).toEqual('ISH_CreditCard');
      expect(paymentMethod.paymentCosts.net).toBePositive();
      expect(paymentMethod.paymentCostsThreshold.net).toBePositive();
      expect(paymentMethod.isRestricted).toBeFalse();
      expect(paymentMethod.saveAllowed).toBeFalse();
    });

    it(`should return a restricted PaymentMethod when getting restricted PaymentMethodData`, () => {
      paymentMethodData.data[0].restricted = true;
      paymentMethodData.data[0].restrictions = [
        {
          message: 'restricition message',
          code: 'restricition code',
        },
      ];
      const paymentMethod = PaymentMethodMapper.fromData(paymentMethodData)[0];
      expect(paymentMethod.isRestricted).toBeTrue();
      expect(paymentMethod.restrictionCauses).toHaveLength(1);
    });

    it(`should return a payment method with parameter definitions if payment method has input parameters`, () => {
      paymentMethodData.data[0].parameterDefinitions = parametersData;
      const paymentMethod = PaymentMethodMapper.fromData(paymentMethodData)[0];

      expect(paymentMethod.saveAllowed).toBeTrue();
      expect(paymentMethod.parameters).toHaveLength(4);
      expect(paymentMethod.parameters[0].type).toEqual('ish-text-input-field');
      expect(paymentMethod.parameters[0].key).toEqual('holder');
      expect(paymentMethod.parameters[0].hide).toBeFalse();
      expect(paymentMethod.parameters[0].templateOptions.type).toEqual('text');
      expect(paymentMethod.parameters[0].templateOptions.required).toBeTrue();

      expect(paymentMethod.parameters[1].templateOptions.pattern).toBe(regexp);
      expect(paymentMethod.parameters[1].templateOptions.minLength).toBe(15);
      expect(paymentMethod.parameters[1].templateOptions.maxLength).toBe(34);
      expect(paymentMethod.parameters[1].templateOptions.attributes).toBeObject();

      expect(paymentMethod.parameters[3].hide).toBeTrue();
    });
  });

  describe('Payment Method Mapper', () => {
    const paymentMethodsData = {
      payments: [
        {
          id: 'ISH_CreditCard',
          serviceID: 'ISH_CreditCard',
          displayName: 'Credit Card',
          paymentCosts: {
            net: {
              value: 40.34,
              currency: 'USD',
            },
            gross: {
              value: 40.34,
              currency: 'USD',
            },
          },
          paymentCostsThreshold: {
            net: {
              value: 40.34,
              currency: 'USD',
            },
            gross: {
              value: 40.34,
              currency: 'USD',
            },
          },
          restricted: false,
        },
      ],
    } as PaymentMethodOptionsDataType;

    const paymentInstrumentsData = [
      {
        id: 'abc',
        name: 'ISH_CreditCard',
        attributes: [
          {
            name: 'cardNumber',
            value: '************1111',
          },
          { name: 'cardType', value: 'vsa' },
        ],
      } as PaymentInstrumentData,
      {
        id: 'xyz',
        name: 'ISH_CreditCard',
        attributes: [
          {
            name: 'cardNumber',
            value: '************4444',
          },
          { name: 'cardType', value: 'msa' },
        ],
      } as PaymentInstrumentData,
    ];

    it(`should return PaymentMethods when getting a PaymentMethodData`, () => {
      const paymentMethods = PaymentMethodMapper.fromOptions({
        methods: [paymentMethodsData],
        instruments: paymentInstrumentsData,
      });

      expect(paymentMethods).toHaveLength(1);
      expect(paymentMethods[0].id).toEqual('ISH_CreditCard');
      expect(paymentMethods[0].paymentInstruments).toHaveLength(2);
      expect(paymentMethods[0].paymentInstruments[0].id).toEqual('abc');
      expect(paymentMethods[0].paymentInstruments[0].parameters).toHaveLength(2);
      expect(paymentMethods[0].paymentInstruments[0].parameters[0].value).toEqual('************1111');
    });
  });
});
