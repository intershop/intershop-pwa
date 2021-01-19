import { NgModule } from '@angular/core';

import { SPECIAL_HTTP_ERROR_HANDLER } from './interceptors/icm-error-mapper.interceptor';
import { createPaymentErrorHandler } from './utils/http-error/create-payment.error-handler';
import { editPasswordErrorHandler } from './utils/http-error/edit-password.error-handler';
import { LoginUserErrorHandler } from './utils/http-error/login-user.error-handler';
import { requestReminderErrorHandler } from './utils/http-error/request-reminder.error-handler';
import { updatePasswordErrorHandler } from './utils/http-error/update-password.error-handler';

@NgModule({
  providers: [
    { provide: SPECIAL_HTTP_ERROR_HANDLER, useValue: updatePasswordErrorHandler, multi: true },
    { provide: SPECIAL_HTTP_ERROR_HANDLER, useClass: LoginUserErrorHandler, multi: true },
    { provide: SPECIAL_HTTP_ERROR_HANDLER, useValue: requestReminderErrorHandler, multi: true },
    { provide: SPECIAL_HTTP_ERROR_HANDLER, useValue: editPasswordErrorHandler, multi: true },
    { provide: SPECIAL_HTTP_ERROR_HANDLER, useValue: createPaymentErrorHandler, multi: true },
  ],
})
export class ConfigurationModule {}
