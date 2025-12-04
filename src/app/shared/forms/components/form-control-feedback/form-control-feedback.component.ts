import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DoCheck, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

type FormErrorMessages = Record<string, string>;

@Component({
  selector: 'ish-form-control-feedback',
  imports: [SlicePipe, TranslatePipe],
  standalone: true,
  templateUrl: './form-control-feedback.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FormControlFeedbackComponent implements DoCheck {
  @Input({ required: true }) control: AbstractControl;
  @Input() messages: FormErrorMessages = {};

  errors: string[];

  ngDoCheck() {
    if (this.control.dirty) {
      this.errors = this.getErrorList();
    }
  }

  private getErrorList(): string[] {
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
