import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { ChangeDetectorRef, DestroyRef, Pipe, PipeTransform, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { PriceItemHelper } from 'ish-core/models/price-item/price-item.helper';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';

import { Price } from './price.model';

export function formatPrice(price: Price, lang: string): string {
  const symbol = getCurrencySymbol(price.currency, 'narrow', lang);
  return symbol ? formatCurrency(price.value, lang, symbol) : price.value?.toString();
}

@Pipe({ name: 'ishPrice', pure: false })
export class PricePipe implements PipeTransform {
  displayText: string;

  private destroyRef = inject(DestroyRef);

  constructor(
    private translateService: TranslateService,
    private cdRef: ChangeDetectorRef,
    private accountFacade: AccountFacade
  ) {}

  transform(data: Price | PriceItem, priceType?: 'gross' | 'net'): string {
    if (!data) {
      return this.translateService.instant('product.price.na.text');
    }

    if (!this.translateService.currentLang) {
      return 'N/A';
    }

    switch (data.type) {
      case 'PriceItem':
        if (priceType) {
          return formatPrice(PriceItemHelper.selectType(data, priceType), this.translateService.currentLang);
        }
        this.accountFacade.userPriceDisplayType$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(type => {
          this.displayText = formatPrice(PriceItemHelper.selectType(data, type), this.translateService.currentLang);
          this.cdRef.markForCheck();
        });
        return this.displayText;
      default:
        return formatPrice(data as Price, this.translateService.currentLang);
    }
  }
}
