import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { HttpErrorMapper } from './http-error.mapper';

describe('Http Error Mapper', () => {
  it('should convert correctly for simple HttpErrorResponse', () => {
    expect(HttpErrorMapper.fromError(new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' })))
      .toMatchInlineSnapshot(`
      Object {
        "error": undefined,
        "errorCode": undefined,
        "headers": Object {},
        "message": "Http failure response for (unknown url): 401 Unauthorized",
        "name": "HttpErrorResponse",
        "status": 401,
        "statusText": "Unauthorized",
      }
    `);
  });
  it('should convert correctly for HttpErrorResponse with headers', () => {
    expect(
      HttpErrorMapper.fromError(
        new HttpErrorResponse({
          status: 500,
          headers: new HttpHeaders().set('key1', 'value1').set('key2', 'value2'),
        })
      )
    ).toMatchInlineSnapshot(`
      Object {
        "error": undefined,
        "errorCode": undefined,
        "headers": Object {
          "key1": "value1",
          "key2": "value2",
        },
        "message": "Http failure response for (unknown url): 500 undefined",
        "name": "HttpErrorResponse",
        "status": 500,
        "statusText": "Unknown Error",
      }
    `);
  });

  it('should convert correctly for simple HttpErrorResponse with error Message', () => {
    expect(
      HttpErrorMapper.fromError(
        new HttpErrorResponse({ status: 401, statusText: 'Unauthorized', error: 'Error Message' })
      )
    ).toMatchSnapshot();
  });

  it('should convert correctly for HttpErrorResponse with errors and causes', () => {
    expect(
      HttpErrorMapper.fromError(
        new HttpErrorResponse({
          status: 422,
          statusText: 'Unprocessable Entity',
          error: {
            errors: [
              {
                message: 'The product could not be added to your basket.',
                causes: [{ message: 'The maximum allowed item quantity is exceeded' }],
              },
            ],
          },
        })
      )
    ).toMatchSnapshot();
  });
});
