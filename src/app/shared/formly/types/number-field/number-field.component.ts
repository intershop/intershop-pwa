import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

/**
 * Type for a number field
 *
 * @defaultWrappers form-field-horizontal & validation
 */
@Component({
  selector: 'ish-number-field',
  templateUrl: './number-field.component.html',
  styleUrls: ['./number-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberFieldComponent extends FieldType<FieldTypeConfig> implements OnInit {
  cannotIncrease = false;
  cannotDecrease = false;

  ngOnInit(): void {
    this.evaluateButtonDisabled();
  }

  increase() {
    this.formControl.setValue(
      Number.parseInt(this.formControl.value) + (this.field.props.step ? this.field.props.step : 1)
    );
    this.evaluateButtonDisabled();
  }

  decrease() {
    this.formControl.setValue(
      Number.parseInt(this.formControl.value) - (this.field.props.step ? this.field.props.step : 1)
    );
    this.evaluateButtonDisabled();
  }

  private evaluateButtonDisabled() {
    this.cannotDecrease = this.field.props.min && this.formControl.value <= this.field.props.min;
    this.cannotIncrease = this.field.props.max && this.formControl.value >= this.field.props.max;
  }
}
