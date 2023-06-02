import { SpecialHttpErrorHandler } from 'ish-core/interceptors/icm-error-mapper.interceptor';

export const updateOciConfigurationErrorHandler: SpecialHttpErrorHandler = {
  test: (error, request) => error.url.endsWith('/oci5/configurations') && request.method === 'PUT',
  map: error => {
    if (error.status === 400) {
      return { message: error.error };
    }
  },
};
