import { ChangeDetectionStrategy, Component, DoCheck, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

interface FormErrorMessages {
  [key: string]: string;
}

@Component({
  selector: 'ish-form-control-feedback',
  templateUrl: './form-control-feedback.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FormControlFeedbackComponent implements DoCheck {
  @Input() messages: FormErrorMessages = {};
  @Input() control: AbstractControl;

  errors: string[];

  ngDoCheck() {
    if (this.control.dirty) {
      this.errors = this.getErrorList();
    }
  }

  getErrorList(): string[] {
    if (!this.control.errors) {
      return [];
    }

    return Object.keys(this.control.errors)
      .map(key =>
        this.messages && key in this.messages && this.messages[key]
          ? this.messages[key]
          : this.control.errors.customError
      )
      .filter(locString => !!locString);
  }
}
