import { SpecialHttpErrorHandler } from 'ish-core/interceptors/icm-error-mapper.interceptor';

export const editPasswordErrorHandler: SpecialHttpErrorHandler = {
  test: error =>
    error.url.endsWith('/credentials/password') &&
    error.headers?.get('error-invalid-attributes')?.includes('currentPassword'),
  map: () => ({ code: 'account.update_password.old_password.error.incorrect' }),
};
