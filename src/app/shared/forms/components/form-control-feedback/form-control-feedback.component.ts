import { NgFor, NgIf, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DoCheck, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from 'ish-core/icon.module';

type FormErrorMessages = Record<string, string>;

@Component({
  selector: 'ish-form-control-feedback',
  templateUrl: './form-control-feedback.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [NgIf, IconModule, TranslateModule, NgFor, SlicePipe],
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
