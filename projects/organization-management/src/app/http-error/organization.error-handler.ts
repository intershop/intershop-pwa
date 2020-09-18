import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SpecialHttpErrorHandler } from 'ish-core/interceptors/icm-error-mapper.interceptor';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

// tslint:disable: ban-types

@Injectable()
export class OrganizationErrorHandler implements SpecialHttpErrorHandler {
  test(httpError: HttpErrorResponse): boolean {
    if (httpError?.error?.errors?.length > 0) {
      return httpError.error.errors[0]?.code.startsWith('organization_hierarchy.');
    }
    return false;
  }
  map(httpError: HttpErrorResponse): Partial<HttpError> {
    const error = httpError.error.errors[0];
    return {
      message: error?.detail,
      code: error?.code,
      status: error?.status,
    };
  }
}
