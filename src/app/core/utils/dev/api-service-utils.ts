import { capture } from 'ts-mockito';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ApiService } from 'ish-core/services/api/api.service';

// tslint:disable:no-console
export function logApiCalls(apiServiceMock: ApiService) {
  for (let i = 0; i < 100; i++) {
    try {
      const args = capture(apiServiceMock.get).byCallIndex(i);
      console.log('GET', args);
    } catch (err) {
      break;
    }
  }
  for (let i = 0; i < 100; i++) {
    try {
      const args = capture(apiServiceMock.post).byCallIndex(i);
      console.log('POST', args);
    } catch (err) {
      break;
    }
  }
  for (let i = 0; i < 100; i++) {
    try {
      const args = capture(apiServiceMock.put).byCallIndex(i);
      console.log('PUT', args);
    } catch (err) {
      break;
    }
  }
}

export function makeHttpError(fields: Partial<HttpError>): HttpError {
  return {
    name: 'HttpErrorResponse',
    ...fields,
  };
}
