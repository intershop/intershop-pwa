import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { CoreState } from '../../core/store/countries';
import { getCurrentLocale } from '../../core/store/locale';
import { Attribute } from './attribute.model';

@Pipe({ name: 'attributeToString' })
export class AttributeToStringPipe implements PipeTransform {

  locale: string;

  constructor(
    store: Store<CoreState>,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
  ) {
    store.pipe(
      select(getCurrentLocale),
      filter(x => !!x),
      map(currentLocale => currentLocale.lang)
    ).subscribe(l => this.locale = l);
  }

  private toDate(val): string {
    return this.datePipe.transform(val, 'shortDate', undefined, this.locale);
  }

  private toDecimal(val): string {
    return this.decimalPipe.transform(val, undefined, this.locale);
  }

  private toCurrency(val, mnemonic): string {
    return this.currencyPipe.transform(val, mnemonic, 'symbol', undefined, this.locale);
  }

  transform(data: Attribute, valuesSeparator: string = ', '): string {
    switch (data.type) {
      case 'String':
        return data.value;
      case 'Integer':
      case 'Double':
      case 'Long':
      case 'BigDecimal':
        return this.toDecimal(data.value);
      case 'Boolean':
        return data.value.toString();
      case 'Date':
        // TODO: ISREST-222 - waiting for adaption of REST API response to return Date values not as 'String' so they can be handled accordingly
        return this.toDate(data.value);
      case 'MultipleInteger':
      case 'MultipleDouble':
      case 'MultipleLong':
      case 'MultipleBigDecimal':
        return data.value.map(v => this.toDecimal(v)).join(valuesSeparator);
      case 'MultipleString':
      case 'MultipleBoolean':
        return data.value.join(valuesSeparator);
      case 'MultipleDate':
        return data.value.map(v => this.toDate(v)).join(valuesSeparator);
      case 'ResourceAttribute':
        switch (data.value.type) {
          case 'Quantity':
            return `${this.toDecimal(data.value.value)}\xA0${data.value.unit}`;
          case 'Money':
            return this.toCurrency(data.value.value, data.value.currencyMnemonic);
          default:
            return data.value.toString();
        }
      default:
        return data.value.toString();
    }
  }
}
