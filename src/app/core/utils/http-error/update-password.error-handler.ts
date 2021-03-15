import { SpecialHttpErrorHandler } from 'ish-core/interceptors/icm-error-mapper.interceptor';

export const updatePasswordErrorHandler: SpecialHttpErrorHandler = {
  test: (error, request) => error.url.endsWith('/security/password') && request.method === 'POST',
  map: error => {
    switch (error.headers.get('error-missing-attributes') || error.headers.get('error-invalid-attributes')) {
      case 'secureCode':
        return { code: 'account.forgotdata.consumer_invalid_hash.error' };
      case 'userID':
        return { code: 'account.forgotdata.consumer_disabled.error' };
      case 'password':
        return { code: 'customer.credentials.passwordreset.invalid_password.error.PasswordExpressionViolation' };
      default:
        return { code: 'account.forgotdata.consumer_password_timeout.error' };
    }
  },
};
