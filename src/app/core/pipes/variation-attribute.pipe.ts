import { formatNumber } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { VariationAttribute } from 'ish-core/models/product-variation/variation-attribute.model';

@Pipe({ name: 'ishVariationAttribute', pure: false })
export class VariationAttributePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  private toDecimal(val: number): string {
    return formatNumber(val, this.translateService.currentLang);
  }

  transform(attr: VariationAttribute): string {
    if (!this.translateService.currentLang) {
      return 'undefined';
    }

    return typeof attr?.value === 'object'
      ? `${this.toDecimal(attr.value.value)}\xA0${attr.value.unit}`
      : typeof attr?.value === 'number'
      ? this.toDecimal(attr.value)
      : attr?.value || 'undefined';
  }
}
