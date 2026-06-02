import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyAttributes } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Type for a basic checkbox field.
 *
 * @props **ariaLabel** adds an aria-label to the component for better accessibility, recommended if there is no associated label
 *
 * @defaultWrappers form-field-checkbox-horizontal
 *
 * @usageNotes
 * Refer to the form-field-checkbox-horizontal wrapper for more info on relevant props.
 */
@Component({
  selector: 'ish-checkbox-field',
  templateUrl: './checkbox-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormlyAttributes, ReactiveFormsModule, TranslatePipe],
})
export class CheckboxFieldComponent extends FieldType<FieldTypeConfig> {}
