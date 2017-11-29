import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { FormElementComponent } from '../form-element/form-element.component';

@Component({
  selector: 'is-select',
  templateUrl: './select.component.html'
})
export class SelectComponent extends FormElementComponent implements OnInit {
  @Input() options: SelectOption[];   // required
  showEmptyOption: boolean;           // is automatically set if the control value is empty

  constructor(
    protected translate: TranslateService
  ) { super(translate); }

  ngOnInit() {
    // tslint:disable-next-line:ban
    super.ngOnInit();

    // set default values for empty component parameters
    super.setDefaultValues();

    // determine / translate label
    this.determineLabel();

    // show empty option if the control value is empty
    this.showEmptyOption = (this.form.get(this.controlName).value) ? false : true;
  }
}

export interface SelectOption {
  value: string;
  label: string;
}
