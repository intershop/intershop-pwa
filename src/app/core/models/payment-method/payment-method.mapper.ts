import { FormlyFieldConfig } from '@ngx-formly/core';

import { PriceMapper } from '../price/price.mapper';

import { PaymentMethodData, PaymentMethodParameterType } from './payment-method.interface';
import { PaymentMethod } from './payment-method.model';

export class PaymentMethodMapper {
  static fromData(data: PaymentMethodData): PaymentMethod {
    if (data) {
      return {
        id: data.id,
        displayName: data.displayName,
        description: data.description,
        isRestricted: data.restricted,
        restrictionCauses: data.restrictions,
        paymentCosts: PriceMapper.fromPriceItem(data.paymentCosts, 'net'),
        paymentCostsThreshold: PriceMapper.fromPriceItem(data.paymentCostsThreshold, 'net'),
        paymentInstruments: data.paymentInstruments,
        parameters:
          data.parameterDefinitions && data.parameterDefinitions.length > 0
            ? PaymentMethodMapper.mapParameter(data.parameterDefinitions)
            : undefined,
      };
    }
  }

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
          param.templateOptions.attributes.size = p.constraints.size.message;
        }
        if (p.constraints.pattern) {
          param.templateOptions.pattern = p.constraints.pattern.regexp;
          param.templateOptions.attributes.pattern = p.constraints.pattern.message;
        }
      }
      return param;
    });
  }
}
