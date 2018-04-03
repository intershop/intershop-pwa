import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Price } from '../../models/price/price.model';

@Pipe({ name: 'ishPrice' })
export class PricePipe implements PipeTransform {
  // TODO: https://github.com/angular/angular/issues/20536
  constructor(private translateService: TranslateService, private currencyPipe: CurrencyPipe) {}

  private toCurrency(price: Price): string {
    return this.currencyPipe.transform(
      price.value,
      price.currencyMnemonic,
      'symbol',
      undefined,
      this.translateService.currentLang
    );
  }

  transform(data: Price): string {
    if (!data) {
      return 'undefined';
    }
    switch (data.type) {
      case 'Money':
      case 'ProductPrice':
        return this.toCurrency(data as Price);
      default:
        return data.toString();
    }
  }
}
