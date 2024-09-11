import { NumberSymbol, formatNumber, getLocaleNumberSymbol } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { provideNgxMask } from 'ngx-mask';

import { ariaDescribedByIds } from 'ish-shared/forms/utils/form-utils';

/**
 * Type for a basic input field
 *
 * @props **ariaLabel** adds an aria-label to the component for better accessibility, recommended if there is no associated label
 * @props **type** supports all text types; 'text' (default), 'email', 'tel'
 * @props **mask** adds a ngx-mask mask (https://www.npmjs.com/package/ngx-mask) to mask the input with a given pattern
 *
 * @defaultWrappers form-field-horizontal & validation
 */
@Component({
  selector: 'ish-text-input-field',
  templateUrl: './text-input-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgxMask()],
})
export class TextInputFieldComponent extends FieldType<FieldTypeConfig> implements OnInit {
  private textInputFieldTypes = ['text', 'email', 'tel'];
  thousandSeparator: string;
  decimalMarker: ',' | '.';

  constructor(private translateService: TranslateService) {
    super();
  }

  // not-dead-code
  onPopulate(field: FormlyFieldConfig) {
    if (!field.props?.type) {
      field.props.type = 'text';
      return;
    }

    if (!this.textInputFieldTypes.includes(field.props.type)) {
      throw new Error(
        'parameter <props.type> is not valid for TextInputFieldComponent, only text, email and tel are possible values'
      );
    }
  }

  ngOnInit(): void {
    if (this.props?.mask?.startsWith('separator')) {
      if (this.props?.mask === 'separator.2' && this.formControl?.value) {
        this.formControl.setValue(formatNumber(this.formControl?.value, 'en_US', '1.2-2').replace(',', ''));
      }
      this.thousandSeparator = getLocaleNumberSymbol(
        this.translateService.currentLang,
        NumberSymbol.CurrencyGroup
      ).trim();
      this.decimalMarker = getLocaleNumberSymbol(this.translateService.currentLang, NumberSymbol.CurrencyDecimal) as
        | '.'
        | ',';
    }
  }

  get ariaDescribedByIds(): string | null {
    return ariaDescribedByIds(this.field.id, this.showError, this.props.customDescription);
  }
}
