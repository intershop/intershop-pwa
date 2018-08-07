import { ChangeDetectionStrategy, Component, DoCheck, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { FormErrorMessages } from './form-error-messages.interface';

@Component({
  selector: 'ish-form-control-feedback',
  templateUrl: './form-control-feedback.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FormControlFeedbackComponent implements DoCheck {
  @Input()
  messages: FormErrorMessages = {};
  @Input()
  control: AbstractControl;

  errors: Array<Observable<string>>;

  constructor(private translate: TranslateService) {}

  ngDoCheck() {
    if (this.control.dirty) {
      this.errors = this.getErrorList();
    }
  }

  getErrorList(): Observable<string>[] {
    if (!this.control.errors) {
      return [];
    }

    return Object.keys(this.control.errors)
      .map(
        key =>
          this.messages && key in this.messages && this.messages[key]
            ? this.messages[key]
            : this.control.errors.customError
      )
      .filter(locString => !!locString)
      .map(locString => this.translate.get(locString));
  }
}
