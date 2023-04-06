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
    if (!body?.data) {
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
          included?.paymentInstruments && data.paymentInstruments
            ? data.paymentInstruments.map(id => included.paymentInstruments[id])
            : undefined,
        parameters: PaymentMethodMapper.mapParameter(data.parameterDefinitions),
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

    if (!options.methods?.length) {
      return [];
    }

    const pmBlacklist = ['ISH_FASTPAY', 'ISH_INVOICE_TOTAL_ZERO'];

    // return only payment methods that have either payment instruments or no parameters
    return options.methods[0].payments
      .map(pm => ({
        id: pm.id,
        serviceId: pm.id, // is missing
        displayName: pm.displayName,
        restrictionCauses: pm.restrictions,
        hasParameters: !!pm.paymentParameters?.length,
        paymentInstruments: options.instruments
          .filter(i => i.name === pm.id)
          .map(i => ({
            id: i.id,
            parameters: i.attributes,
            accountIdentifier: PaymentMethodMapper.determineAccountIdentifier(i),
            paymentMethod: pm.id,
          })),
      }))
      .filter(pm => !pmBlacklist.includes(pm.serviceId))
      .filter(pm => !pm.hasParameters || pm.paymentInstruments?.length);
  }

  /**
   * returns the payment instrument's account identifier if present, else it returns all the attributes
   * add further special functionality here, if needed
   */
  private static determineAccountIdentifier(pi: PaymentInstrumentData): string {
    return pi.accountIdentifier
      ? pi.accountIdentifier
      : pi.attributes
          ?.filter(attr => attr.name !== 'paymentInstrumentId')
          .map(attr => attr.value)
          .reduce((acc, val) => (val ? `${acc}  ${val}` : acc));
  }

  /**
   * determines if payment method is valid and is available
   * valid: payment methods without capabilities or which have no capabilities given in the list below
   */
  private static isPaymentMethodValid(paymentData: PaymentMethodBaseData): boolean {
    const invalidCapabilities = ['LimitedTender', 'FastCheckout'];

    // without capabilities
    if (!paymentData.capabilities?.length) {
      return true;
    }

    // excluded by the invalidCapabilities list
    return !paymentData.capabilities.some(data => invalidCapabilities.includes(data));
  }

  /**
   * maps form parameter if there are some (like credit card or direct debit)
   */
  private static mapParameter(parametersData: PaymentMethodParameterType[]): FormlyFieldConfig[] {
    if (!parametersData) {
      return;
    }
    return parametersData.map(p => {
      const param: FormlyFieldConfig = {
        key: p.name,
        type: p.options ? 'ish-select-field' : 'ish-text-input-field',
        props: {
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
          param.props.required = true;
          param.validation.messages = { ...param.validation.messages, required: p.constraints.required.message };
        }
        if (p.constraints.size) {
          param.props.minLength = p.constraints.size.min;
          param.props.maxLength = p.constraints.size.max;
          param.validation.messages = {
            ...param.validation.messages,
            minLength: p.constraints.size.message,
            maxLength: p.constraints.size.message,
          };
        }
        if (p.constraints.pattern) {
          param.props.pattern = p.constraints.pattern.regexp;
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
    const mandateEntry = hostedPaymentPageParameters.find(p => p.name === 'Concardis_SEPA_Mandate');

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
