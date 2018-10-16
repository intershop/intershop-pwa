import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { FormElement } from '../form-element';

@Component({
  selector: 'ish-input',
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class InputComponent extends FormElement implements OnInit {
  @Input()
  type = 'text'; // values: 'text' (default), 'password', 'email'
  @Input()
  maxlength = '60';
  @Input()
  autocomplete?: string; /* default = undefined  for input type 'text' and 'email' (autocomplete not set)
                                             = 'off' for input type 'password' */
  @Input()
  min?: number;
  @Input()
  max?: number;

  @Input()
  placeholderText?: string;

  calculatedAutocomplete: string;

  constructor(protected translate: TranslateService) {
    super(translate);
  }

  ngOnInit() {
    super.init();

    // set default values for empty component parameters
    this.setDefaultValues();

    // check type is valid
    const types = 'text|password|email|number';
    if (!types.includes(this.type)) {
      throw new Error(
        'input parameter <type> is not valid for InputComponent, only text, email, password and number are possible types'
      );
    }
  }

  /*
    set default values for empty input parameters
  */
  protected setDefaultValues() {
    this.calculatedAutocomplete = this.autocomplete ? this.autocomplete : this.type === 'password' ? 'off' : undefined;
  }
}
