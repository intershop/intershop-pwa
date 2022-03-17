import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedUiFormlyModule } from '@intershop-pwa/formly/shared-ui-formly.module';
import { IconModule } from '@intershop-pwa/icon/icon.module';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';

import { FormControlFeedbackComponent } from './components/form-control-feedback/form-control-feedback.component';
import { ShowFormFeedbackDirective } from './directives/show-form-feedback.directive';
import { PaymentInstrumentsDeleteWrapperComponent } from './formly/payment-instruments-delete-wrapper/payment-instruments-delete-wrapper.component';
import { PaymentMethodWrapperComponent } from './formly/payment-method-wrapper/payment-method-wrapper.component';
import { PaymentParametersTypeComponent } from './formly/payment-parameters-type/payment-parameters-type.component';
import { PaymentSaveCheckboxComponent } from './formly/payment-save-checkbox/payment-save-checkbox.component';
import { PaymentMethodFacade } from './payment-method-facade/payment-method.facade';

@NgModule({
  imports: [
    FormlyModule.forChild({
      types: [{ name: 'ish-payment-parameters-type', component: PaymentParametersTypeComponent }],
      wrappers: [
        {
          name: 'ish-payment-method-wrapper',
          component: PaymentMethodWrapperComponent,
        },
        {
          name: 'ish-payment-instruments-delete-wrapper',
          component: PaymentInstrumentsDeleteWrapperComponent,
        },
      ],
    }),
    CommonModule,
    IconModule,
    SharedUiFormlyModule,
    TranslateModule,
  ],
  declarations: [
    FormControlFeedbackComponent,
    PaymentInstrumentsDeleteWrapperComponent,
    PaymentMethodWrapperComponent,
    PaymentParametersTypeComponent,
    PaymentSaveCheckboxComponent,
    ShowFormFeedbackDirective,
  ],
  exports: [FormControlFeedbackComponent, PaymentSaveCheckboxComponent, ShowFormFeedbackDirective],
  providers: [PaymentMethodFacade],
})
export class PaymentMethodBaseModule {}
