import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { FormElementComponent } from '../form-element/form-element.component';


@Component({
  selector: 'is-input',
  templateUrl: './input.component.html'
})
export class InputComponent extends FormElementComponent implements OnInit {
  @Input() type: string;        // values: 'text' (default), 'password', 'email'
  @Input() maxlength: string;   // default: 60
  @Input() autocomplete: string; /* values: 'on' (default for input type 'text' and 'email'),
                                           'off' (default for input type 'password') */

  constructor(
    protected translate: TranslateService
  ) { super(translate); }

  ngOnInit() {
    // tslint:disable-next-line:ban
    super.ngOnInit();

    // set default values for empty component parameters
    this.setDefaultValues();

    // determine / translate label
    super.determineLabel();

    // check type is valid
    const types = 'text|password|email';
    if (!types.includes(this.type)) {
      throw new Error('input parameter <type> is not valid for InputComponent, only text, email and password are possible types');
    }
  }

  /*
    set default values for empty input parameters
  */
  protected setDefaultValues() {
    super.setDefaultValues();   // set general default values
    if (!this.type) { this.type = 'text'; }
    if (!this.maxlength) { this.maxlength = '60'; }
    if (!this.autocomplete) { this.autocomplete = (this.type === 'password' ? 'off' : ''); }
  }
}
