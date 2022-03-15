import { InjectionToken } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';

export interface PaymentMethodConfiguration {
  id: string;
  getFormlyFieldConfig$(paymentMethodId: string): Observable<FormlyFieldConfig>;
}

export const PAYMENT_METHOD = new InjectionToken<PaymentMethodConfiguration>('paymentMethod');
