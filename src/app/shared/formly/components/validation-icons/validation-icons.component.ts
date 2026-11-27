import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { EMPTY, merge } from 'rxjs';

/**
 * Component that displays either a cross or a check mark to indicate validity.
 *
 * @props **showValidation** - a function of type ``(field: FormlyFieldConfig) => boolean``
 * that can be used to override the check mark display condition.
 *
 */
@Component({
  selector: 'ish-validation-icons',
  standalone: false,
  templateUrl: './validation-icons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationIconsComponent implements OnInit {
  @Input({ required: true }) field: FormlyFieldConfig;
  @Input() showError: boolean;

  private cd = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  // the field reference never changes, so control state and form submits have to trigger the check
  ngOnInit() {
    merge<unknown[]>(this.field.formControl?.events ?? EMPTY, this.field.options?.parentForm?.ngSubmit ?? EMPTY)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cd.markForCheck());
  }

  defaultShowValidation() {
    return (
      this.field.formControl?.valid && (this.field.formControl?.dirty || this.field.options?.parentForm?.submitted)
    );
  }
}
