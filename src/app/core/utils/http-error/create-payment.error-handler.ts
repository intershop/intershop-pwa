import { SpecialHttpErrorHandler } from 'ish-core/interceptors/icm-error-mapper.interceptor';

export const createPaymentErrorHandler: SpecialHttpErrorHandler = {
  test: (error, request) => error.url.endsWith('/payments') && request.method === 'POST',
  map: error => {
    if (error?.error && error.error.includes('{') && error.error.includes('}')) {
      return { code: error.error.slice(error.error.indexOf('{') + 1, error.error.indexOf('}')) };
    }
  },
};
