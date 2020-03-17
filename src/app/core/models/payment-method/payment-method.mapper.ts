import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { PaymentInstrumentData } from 'ish-core/models/payment-instrument/payment-instrument.interface';
import { PriceMapper } from 'ish-core/models/price/price.mapper';

import {
  PaymentMethodBaseData,
  PaymentMethodData,
  PaymentMethodOptionsDataType,
  PaymentMethodParameterType,
} from './payment-method.interface';
import { PaymentMethod } from './payment-method.model';

@Injectable({ providedIn: 'root' })
export class PaymentMethodMapper {
  constructor(private priceMapper: PriceMapper) {}

  // is needed for getting a user's eligible payment methods
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
   * the general identifier returns all payment instrument attributes
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
        identifier =
          pi.attributes &&
          pi.attributes.length &&
          pi.attributes
            .filter(attr => attr.name !== 'paymentInstrumentId')
            .map(attr => attr.value)
            .reduce((acc, val) => (val ? `${acc}  ${val}` : acc));
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
        type: p.options ? 'select' : 'input',
        templateOptions: {
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
      };

      if (p.constraints) {
        if (p.constraints.required) {
          param.templateOptions.required = true;
          param.templateOptions.attributes.required = p.constraints.required.message;
        }
        if (p.constraints.size) {
          param.templateOptions.minLength = p.constraints.size.min;
          param.templateOptions.maxLength = p.constraints.size.max;
          param.templateOptions.attributes.minLength = p.constraints.size.message;
          param.templateOptions.attributes.maxLength = p.constraints.size.message;
        }
        if (p.constraints.pattern) {
          param.templateOptions.pattern = p.constraints.pattern.regexp;
          param.templateOptions.attributes.pattern = p.constraints.pattern.message;
        }
      }
      return param;
    });
  }

  fromData(body: PaymentMethodData): PaymentMethod[] {
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
        paymentCosts: this.priceMapper.fromPriceItem(data.paymentCosts, 'net'),
        paymentCostsThreshold: this.priceMapper.fromPriceItem(data.paymentCostsThreshold, 'net'),
        paymentInstruments:
          included && included.paymentInstruments && data.paymentInstruments
            ? data.paymentInstruments.map(id => included.paymentInstruments[id])
            : undefined,
        parameters: data.parameterDefinitions ? PaymentMethodMapper.mapParameter(data.parameterDefinitions) : undefined,
        hostedPaymentPageParameters: data.hostedPaymentPageParameters,
      }));
  }
}
