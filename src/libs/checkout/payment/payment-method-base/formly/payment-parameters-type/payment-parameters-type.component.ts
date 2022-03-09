import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ish-payment-parameters-type',
  templateUrl: './payment-parameters-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentParametersTypeComponent extends FieldType implements OnInit {
  isFormOpened = false;

  defaultOptions = {
    defaultValue: {},
  };

  ngOnInit(): void {
    console.log(this.field.fieldGroup);
  }
}
