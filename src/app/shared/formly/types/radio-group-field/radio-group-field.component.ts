import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';

/**
 * Type that will render radio buttons in a line.
 */
@Component({
  selector: 'ish-radio-group-field',
  templateUrl: './radio-group-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormlySelectModule, ReactiveFormsModule],
})
export class RadioGroupFieldComponent extends FieldType<FieldTypeConfig> {}
