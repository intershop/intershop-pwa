import { FormlyFieldConfig } from '@ngx-formly/core';

import { PaymentInstrumentData } from 'ish-core/models/payment-instrument/payment-instrument.interface';
import { PriceItemMapper } from 'ish-core/models/price-item/price-item.mapper';

import {
  PaymentMethodBaseData,
  PaymentMethodData,
  PaymentMethodOptionsDataType,
  PaymentMethodParameterType,
} from './payment-method.interface';
import { PaymentMethod } from './payment-method.model';

export class PaymentMethodMapper {
  static fromData(body: PaymentMethodData): PaymentMethod[] {
    if (!body || !body.data) {
      throw new Error(`'paymentMethodData' is required`);
    }

    const included = body.included;

    if (!body.data.length) {
      return [];
    }
    return body.data
      .filter(data => PaymentMethodMapper.isPaymentMethodValid(data))
      .map(data => ({
        id: data.id,
        serviceId: data.serviceID,
        displayName: data.displayName,
        description: data.description,
        capabilities: data.capabilities,
        isRestricted: data.restricted,
        saveAllowed: data.saveAllowed && !!data.parameterDefinitions && !!data.parameterDefinitions.length,
        restrictionCauses: data.restrictions,
        paymentCosts: PriceItemMapper.fromPriceItem(data.paymentCosts),
        paymentCostsThreshold: PriceItemMapper.fromPriceItem(data.paymentCostsThreshold),
        paymentInstruments:
          included && included.paymentInstruments && data.paymentInstruments
            ? data.paymentInstruments.map(id => included.paymentInstruments[id])
            : undefined,
        parameters: data.parameterDefinitions ? PaymentMethodMapper.mapParameter(data.parameterDefinitions) : undefined,
        hostedPaymentPageParameters:
          data.serviceID === 'Concardis_DirectDebit'
            ? PaymentMethodMapper.mapSEPAMandateInformation(data.hostedPaymentPageParameters)
            : data.hostedPaymentPageParameters,
      }));
  }

  /**
   * get a user's eligible payment methods
   */
  static fromOptions(options: {
    methods: PaymentMethodOptionsDataType[];
    instruments: PaymentInstrumentData[];
  }): PaymentMethod[] {
    if (!options) {
      throw new Error(`'paymentMethodOptions' are required`);
    }

    if (!options.methods || !options.methods.length) {
      return [];
    }

    // return only payment methods that have also a payment instrument
    return options.methods[0].payments
      .map(pm => ({
        id: pm.id,
        serviceId: pm.id, // is missing
        displayName: pm.displayName,
        restrictionCauses: pm.restrictions,
        paymentInstruments: options.instruments
          .filter(i => i.name === pm.id)
          .map(i => ({
            id: i.id,
            parameters: i.attributes,
            accountIdentifier: PaymentMethodMapper.determineAccountIdentifier(pm, i),
            paymentMethod: pm.id,
          })),
      }))
      .filter(x => x.paymentInstruments && x.paymentInstruments.length);
  }

  /**
   * determines the accountIdentifier - this temporary method will be obsolete, if #IS-29004, #IS-29006 have been fixed
   * the general identifier returns account identifier attribute if present, else it returns all the attributes
   * a specific identifier is only returned for ISH_CREDITCARD, add further special functionality here, if needed
   */
  private static determineAccountIdentifier(pm: PaymentMethodBaseData, pi: PaymentInstrumentData): string {
    let identifier: string;

    switch (pm.id) {
      case 'ISH_CREDITCARD': {
        identifier = `${PaymentMethodMapper.mapCreditCardCode(pi.attributes[1].value)} ${pi.attributes[0].value} ${
          pi.attributes[2].value
        }`;
        break;
      }
      default: {
        if (pi.accountIdentifier) {
          identifier = pi.accountIdentifier;
        } else {
          identifier = pi.attributes
            ?.filter(attr => attr.name !== 'paymentInstrumentId')
            .map(attr => attr.value)
            .reduce((acc, val) => (val ? `${acc}  ${val}` : acc));
        }
      }
    }

    return identifier;
  }

  /**
   * maps the credit card code for ISH_CREDITCARD - this temporary method will be obsolete, if #IS-29004, #IS-29006 have been fixed
   */
  private static mapCreditCardCode(code: string): string {
    let creditCardType: string;
    switch (code) {
      case 'amx': {
        creditCardType = 'American Express';
        break;
      }
      case 'mas': {
        creditCardType = 'Master Card';
        break;
      }
      case 'vsa': {
        creditCardType = 'VISA';
        break;
      }
      case 'dcv': {
        creditCardType = 'Discover';
        break;
      }
      default: {
        creditCardType = code;
      }
    }
    return creditCardType;
  }

  /**
   * determines if payment method is valid and is available
   * valid: payment methods without capabilities or which have no capabilities given in the list below
   */
  private static isPaymentMethodValid(paymentData: PaymentMethodBaseData): boolean {
    const invalidCapabilities = ['LimitedTender', 'FastCheckout'];

    // without capabilities
    if (!paymentData.capabilities || !paymentData.capabilities.length) {
      return true;
    }

    // excluded by the invalidCapabilities list
    return !paymentData.capabilities.some(data => invalidCapabilities.includes(data));
  }

  /**
   * maps form parameter if there are some (like credit card or direct debit)
   */
  private static mapParameter(parametersData: PaymentMethodParameterType[]): FormlyFieldConfig[] {
    return parametersData.map(p => {
      const param: FormlyFieldConfig = {
        key: p.name,
        type: p.options ? 'ish-select-field' : 'ish-text-input-field',
        templateOptions: {
          labelClass: 'col-md-4',
          fieldClass: 'col-sm-6',
          type: p.type === 'string' ? 'text' : (p.type as string).toLowerCase(),
          label: p.displayName,
          placeholder: p.description,
          defaultValue: '',
          options:
            p.options && p.options.length > 0
              ? p.options.map(option => ({ label: option.displayName, value: option.id }))
              : undefined,
          attributes: {},
        },
        validation: {
          messages: {},
        },
        hide: p.hidden,
      };

      if (p.constraints) {
        if (p.constraints.required) {
          param.templateOptions.required = true;
          param.validation.messages = { ...param.validation.messages, required: p.constraints.required.message };
        }
        if (p.constraints.size) {
          param.templateOptions.minLength = p.constraints.size.min;
          param.templateOptions.maxLength = p.constraints.size.max;
          param.validation.messages = {
            ...param.validation.messages,
            minLength: p.constraints.size.message,
            maxLength: p.constraints.size.message,
          };
        }
        if (p.constraints.pattern) {
          param.templateOptions.pattern = p.constraints.pattern.regexp;
          param.validation.messages = {
            ...param.validation.messages,
            pattern: p.constraints.pattern.message,
          };
        }
      }
      return param;
    });
  }

  /**
   * convenience method to restructure concardis sepa mandate hosted payment page parameter
   */
  private static mapSEPAMandateInformation(
    hostedPaymentPageParameters: { name: string; value: string }[]
  ): { name: string; value: string }[] {
    const mandateEntry = hostedPaymentPageParameters.find(hppp => hppp.name === 'Concardis_SEPA_Mandate');

    if (typeof mandateEntry.value !== 'string') {
      const sepaMandateArray = mandateEntry.value as {
        mandateId: string;
        mandateText: string;
        directDebitType: string;
      };
      hostedPaymentPageParameters.push({ name: 'mandateId', value: sepaMandateArray.mandateId });
      hostedPaymentPageParameters.push({ name: 'mandateText', value: sepaMandateArray.mandateText });
      hostedPaymentPageParameters.push({ name: 'directDebitType', value: sepaMandateArray.directDebitType });
    }

    return hostedPaymentPageParameters;
  }
}
