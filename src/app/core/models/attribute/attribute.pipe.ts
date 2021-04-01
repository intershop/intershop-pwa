import { formatNumber } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Price } from 'ish-core/models/price/price.model';
import { formatPrice } from 'ish-core/models/price/price.pipe';
import { formatISHDate } from 'ish-core/pipes/date.pipe';

import { Attribute } from './attribute.model';

@Pipe({ name: 'ishAttribute', pure: false })
export class AttributeToStringPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  private toDate(val: string | number | Date): string {
    return formatISHDate(val, 'shortDate', this.translateService.currentLang);
  }

  private toDecimal(val: number): string {
    return formatNumber(val, this.translateService.currentLang);
  }

  private toCurrency(price: Price): string {
    return formatPrice(price, this.translateService.currentLang);
  }

  transform(data: Attribute, valuesSeparator: string = ', '): string {
    if (!this.translateService.currentLang) {
      return 'undefined';
    }

    switch (data.type) {
      case 'String':
        return data.value as string;
      case 'Integer':
      case 'Double':
      case 'Long':
      case 'BigDecimal':
        return this.toDecimal(data.value as number);
      case 'Boolean':
        return data.value.toString();
      case 'Date':
        return this.toDate(data.value as string | number | Date);
      case 'MultipleInteger':
      case 'MultipleDouble':
      case 'MultipleLong':
      case 'MultipleBigDecimal':
        return Array.isArray(data.value) && data.value.map(v => this.toDecimal(v)).join(valuesSeparator);
      case 'MultipleString':
      case 'MultipleBoolean':
        return Array.isArray(data.value) && data.value.join(valuesSeparator);
      case 'MultipleDate':
        return Array.isArray(data.value) && data.value.map(v => this.toDate(v)).join(valuesSeparator);
      case 'ResourceAttribute':
        const resourceAttribute = data as Attribute<{ type: string }>;
        switch (resourceAttribute.value.type) {
          case 'Quantity':
            const quantityAttribute = data as Attribute<{ value: unknown; unit: string }>;
            return `${this.toDecimal(quantityAttribute.value.value as number)}\xA0${quantityAttribute.value.unit}`;
          case 'Money':
            return this.toCurrency(data.value as Price);
          default:
            return data.value.toString();
        }
      default:
        return data.value.toString();
    }
  }
}
