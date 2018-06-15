import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Price } from '../../models/price/price.model';

export function formatPrice(price: Price, lang: string): string {
  const symbol = getCurrencySymbol(price.currencyMnemonic, 'wide', lang);
  return formatCurrency(price.value, lang, symbol);
}

@Pipe({ name: 'ishPrice', pure: false })
export class PricePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(data: Price): string {
    if (!data || !this.translateService.currentLang) {
      return 'undefined';
    }
    switch (data.type) {
      case 'Money':
      case 'ProductPrice':
        return formatPrice(data, this.translateService.currentLang);
      default:
        return data.toString();
    }
  }
}
