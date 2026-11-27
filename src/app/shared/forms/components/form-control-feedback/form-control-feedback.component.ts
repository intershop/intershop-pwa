import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { ReplaySubject, switchMap } from 'rxjs';

type FormErrorMessages = Record<string, string>;

/**
 * Displays the validity icon and the first error message of a dirty form control.
 */
@Component({
  selector: 'ish-form-control-feedback',
  standalone: false,
  templateUrl: './form-control-feedback.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormControlFeedbackComponent implements OnChanges {
  @Input({ required: true }) control: AbstractControl;
  @Input() messages: FormErrorMessages = {};

  errors: string[];

  private cd = inject(ChangeDetectorRef);
  private control$ = new ReplaySubject<AbstractControl>(1);

  constructor() {
    // the control reference does not change with the control state, so control events have to trigger the check
    this.control$
      .pipe(
        switchMap(control => control.events),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.errors = this.getErrorList();
        this.cd.markForCheck();
      });
  }

  ngOnChanges(changes: SimpleChanges<FormControlFeedbackComponent>) {
    if (changes.control) {
      this.control$.next(this.control);
    }
    this.errors = this.getErrorList();
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
