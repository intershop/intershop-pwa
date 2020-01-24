import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Price } from './price.model';

export function formatPrice(price: Price, lang: string): string {
  const symbol = getCurrencySymbol(price.currency, 'wide', lang);
  return formatCurrency(price.value, lang, symbol);
}

@Pipe({ name: 'ishPrice', pure: false })
export class PricePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(data: Price): string {
    if (!data) {
      return this.translateService.instant('product.price.na.text');
    }

    if (!this.translateService.currentLang) {
      return 'N/A';
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
