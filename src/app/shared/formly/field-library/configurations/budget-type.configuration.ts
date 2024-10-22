import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';

import { FieldLibraryConfiguration } from 'ish-shared/formly/field-library/configurations/field-library-configuration';

/**
 * Taxation ID, not required by default
 */
@Injectable()
export class BudgetTypeConfiguration extends FieldLibraryConfiguration {
  id = 'budgetPriceType';

  constructor(private translateService: TranslateService) {
    super();
  }

  getFieldConfig(): FormlyFieldConfig {
    return {
      type: 'ish-budget-type-field',
      defaultValue: 'gross',
      props: {
        label: this.translateService.instant('account.costcenter.profile.price.type.label').concat(':'),
        options: [
          {
            value: 'gross',
            label: 'account.costcenter.gross.label',
            inputClass: '',
            labelClass: '',
          },
          {
            value: 'net',
            label: 'account.costcenter.net.label',
          },
        ],
      },
    };
  }
}
