import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { ConcardisDirectDebitPaymentMethodInterceptor } from './interceptor/concardis-direct-debit-payment-method.interceptor';

@NgModule({
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ConcardisDirectDebitPaymentMethodInterceptor, multi: true }],
})
export class ConcardisDirectDebitPaymentMethodModule {}
