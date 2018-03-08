import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormElement } from '../form-element';
import { SelectOption } from './select-option.interface';

@Component({
  selector: 'ish-select',
  templateUrl: './select.component.html'
})
export class SelectComponent extends FormElement implements OnInit {
  @Input() options: SelectOption[];   // required
  @Input() translateOptionLabels = false;
  @Input() translateOptionValues = false;

  showEmptyOption: boolean;           // is automatically set if the control value is empty

  constructor(
    protected translate: TranslateService
  ) {
    super(translate);
  }

  ngOnInit() {
    this.componentInit();
  }

  protected componentInit() {
    super.init();

    // show empty option if the control value is empty
    this.showEmptyOption = !this.form.get(this.controlName).value;
  }
}
