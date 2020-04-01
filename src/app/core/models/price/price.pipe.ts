import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { PriceItemHelper } from 'ish-core/models/price-item/price-item.helper';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';

import { Price } from './price.model';

export function formatPrice(price: Price, lang: string): string {
  const symbol = getCurrencySymbol(price.currency, 'wide', lang);
  return formatCurrency(price.value, lang, symbol);
}

@Pipe({ name: 'ishPrice', pure: false })
export class PricePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(data: Price | PriceItem): string {
    if (!data) {
      return this.translateService.instant('product.price.na.text');
    }

    if (!this.translateService.currentLang) {
      return 'N/A';
    }

    switch (data.type) {
      case 'PriceItem':
        return formatPrice(PriceItemHelper.selectType(data, 'gross'), this.translateService.currentLang);
      default:
        return formatPrice(data as Price, this.translateService.currentLang);
    }
  }
}
