import { SpecialHttpErrorHandler } from 'ish-core/interceptors/icm-error-mapper.interceptor';

export const requestReminderErrorHandler: SpecialHttpErrorHandler = {
  test: error => error.url.endsWith('/security/reminder'),
  map: error => {
    switch (error.status) {
      case 401:
        return { code: 'captcha.incorrect' };
      case 500:
        return { code: 'servererror.mailServer.error' };
      default:
        return { code: 'account.forgotdata.email.invalid_login_or_name.error' };
    }
  },
};
