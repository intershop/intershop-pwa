import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { FormElementComponent } from 'ish-shared/forms/components/form-element/form-element.component';
import { SelectOption } from 'ish-shared/forms/components/select/select.component';

/**
 * The Select Year Month Component allows the user to select a month/year. The appropriate form with a month and a year control has to be provided by the parent.
 * After user selection the form fields contain a 2 digit month and a 2 digit year string.
 * The component is intended to select an expiration date for credit cards but can be extended for other purposes in future.
 *
 * @example
 * <ish-select-year-month
    [form]="parameterForm"
    label="checkout.credit_card.expiration_date.label"
    [controlName]="['expirationMonth', expirationYear]"
    inputClass="col-sm-6"
    ></ish-select-year-month>
 */
@Component({
  selector: 'ish-select-year-month',
  templateUrl: './select-year-month.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SelectYearMonthComponent extends FormElementComponent implements OnInit {
  /**
   *  number of years which will be displayed beginning with the current year ending in the future
   */
  @Input() yearsCount = 6;
  /**
   *  additional css class for the component
   */
  @Input() cssClass = '';

  monthOptions = [
    { label: '01', value: '01' },
    { label: '02', value: '02' },
    { label: '03', value: '03' },
    { label: '04', value: '04' },
    { label: '05', value: '05' },
    { label: '06', value: '06' },
    { label: '07', value: '07' },
    { label: '08', value: '08' },
    { label: '09', value: '09' },
    { label: '10', value: '10' },
    { label: '11', value: '11' },
    { label: '12', value: '12' },
  ];

  yearOptions: SelectOption[] = [];

  /*
    constructor
  */
  constructor(protected translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    this.setDefaultValues(); // call this method before parent init
    super.init();
  }

  /*
   set default values for empty input parameters
  */
  private setDefaultValues() {
    if (!this.controlName) {
      this.controlName = ['month', 'year'];
    }
    this.label = this.label || 'checkout.credit_card.expiration_date.label';
    if (!this.errorMessages) {
      this.errorMessages = [
        {
          required: 'account.date.month.error.required',
        },
        {
          required: 'account.date.year.error.required',
        },
      ];
    }

    const currentDate = new Date();
    let i: number;

    for (i = currentDate.getFullYear(); i < currentDate.getFullYear() + this.yearsCount; i++) {
      this.yearOptions.push({ label: i.toString(), value: i.toString().slice(2) });
    }
  }
}
