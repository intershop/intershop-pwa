import { Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { from } from 'rxjs/observable/from';
import { map, mergeAll, switchMap } from 'rxjs/operators';

import { FormErrorMessages } from './form-error-messages.interface';


@Component({
  selector: 'ish-form-control-error',
  templateUrl: './form-control-error.component.html'
})
export class FormControlErrorComponent implements DoCheck {
  @Input() messages: FormErrorMessages = {};
  @Input() control: AbstractControl;

  errors: Observable<string>[];

  constructor(private translate: TranslateService) {}

  ngDoCheck() {
    if (this.control.dirty) {
      this.errors = this.getErrorList();
    }
  }

  get iconClasses(): { [key: string]: boolean } {
    return {
      'glyphicon-remove': this.control.invalid,
      'glyphicon-ok': this.control.valid
    };
  }

  getErrorList(): Observable<string>[] {
    if (!this.control.errors) { return []; }

    return Object.keys(this.control.errors)
      .map(key => (this.messages && key in this.messages && this.messages[key]) ?
        this.messages[key] :
        this.control.errors['customError']
      )
      .filter(locString => !!locString)
      .map(locString => this.translate.get(locString));
  }
}
