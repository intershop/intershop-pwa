import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import {
  ICMErrorMapperInterceptor,
  SPECIAL_HTTP_ERROR_HANDLER,
  SpecialHttpErrorHandler,
} from './icm-error-mapper.interceptor';

describe('Icm Error Mapper Interceptor', () => {
  let httpController: HttpTestingController;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HTTP_INTERCEPTORS, useClass: ICMErrorMapperInterceptor, multi: true }],
    });

    httpController = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should convert text responses to simplified format', done => {
    http.get('some').subscribe(fail, error => {
      expect(error).toMatchInlineSnapshot(`
          Object {
            "message": "Unauthorized",
            "name": "HttpErrorResponse",
            "status": 401,
          }
        `);
      done();
    });

    httpController.expectOne('some').flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should convert empty responses to simplified format', done => {
    http.get('some').subscribe(fail, error => {
      expect(error).toMatchInlineSnapshot(`
        Object {
          "message": "Http failure response for some: 400 Bad Request",
          "name": "HttpErrorResponse",
          "status": 400,
        }
      `);
      done();
    });

    httpController.expectOne('some').flush(
      // tslint:disable-next-line: no-null-keyword
      null,
      { status: 400, statusText: 'Bad Request' }
    );
  });

  it('should convert ICM errors format with cause to simplified format concatenating all causes', done => {
    http.get('some').subscribe(fail, error => {
      expect(error).toMatchInlineSnapshot(`
        Object {
          "message": "The promotion code could not be added. The promotion code could not be found. Some other error.",
          "name": "HttpErrorResponse",
          "status": 422,
        }
      `);
      done();
    });

    httpController.expectOne('some').flush(
      {
        errors: [
          {
            causes: [
              {
                code: 'basket.promotion_code.add_code_promotion_code_not_found.error',
                message: 'The promotion code could not be found.',
                paths: ['$.code'],
              },
              {
                code: 'some.other.error',
                message: 'Some other error.',
                paths: ['$.code'],
              },
            ],
            code: 'basket.promotion_code.add_not_successful.error',
            message: 'The promotion code could not be added.',
            status: '422',
          },
        ],
      },
      { status: 422, statusText: 'Unprocessable Entity' }
    );
  });

  it('should convert ICM errors format to simplified format', done => {
    http.get('some').subscribe(fail, error => {
      expect(error).toMatchInlineSnapshot(`
        Object {
          "message": "The product could not be added to your cart.",
          "name": "HttpErrorResponse",
          "status": 422,
        }
      `);
      done();
    });

    httpController.expectOne('some').flush(
      {
        errors: [
          {
            code: 'basket.add_line_item_not_successful.error',
            message: 'The product could not be added to your cart.',
            paths: ['$[0]'],
            status: '422',
          },
        ],
      },
      { status: 422, statusText: 'Unprocessable Entity' }
    );
  });

  it('should convert error-key header responses to simplified format', done => {
    http.get('some').subscribe(fail, error => {
      expect(error).toMatchInlineSnapshot(`
        Object {
          "code": "customer.credentials.login.not_unique.error",
          "name": "HttpErrorResponse",
          "status": 409,
        }
      `);
      done();
    });

    httpController.expectOne('some').flush('Conflict (Login name is not unique (it already exists))', {
      status: 409,
      statusText: 'Conflict',
      headers: { 'error-key': 'customer.credentials.login.not_unique.error' },
    });
  });

  it('should convert error-missing-attributes header responses to debug format', done => {
    http.get('some').subscribe(fail, error => {
      expect(error).toMatchInlineSnapshot(`
        Object {
          "message": "Bad Request (The following attributes are missing: email,preferredLanguage)",
          "name": "HttpErrorResponse",
          "status": 400,
        }
      `);
      done();
    });

    httpController
      .expectOne('some')
      .flush('Bad Request (The following attributes are missing: email,preferredLanguage)', {
        status: 400,
        statusText: 'Bad Request',
        headers: {
          'error-key': 'customer.missing_fields.error',
          'error-missing-attributes': 'email,preferredLanguage',
          'error-type': 'error-missing-attributes',
        },
      });
  });

  it('should convert error-invalid-attributes header responses to debug format', done => {
    http
      .post('some', {
        email: 'asdf@.',
        preferredLanguage: 'ASDF',
        some: { other: 'field' },
      })
      .subscribe(fail, error => {
        expect(error).toMatchInlineSnapshot(`
          Object {
            "message": "Bad Request (The following attributes are invalid: email,preferredLanguage){\\"email\\":\\"asdf@.\\",\\"preferredLanguage\\":\\"ASDF\\"}",
            "name": "HttpErrorResponse",
            "status": 400,
          }
        `);
        done();
      });

    httpController
      .expectOne('some')
      .flush('Bad Request (The following attributes are invalid: email,preferredLanguage)', {
        status: 400,
        statusText: 'Bad Request',
        headers: {
          'error-key': 'customer.invalid_fields.error',
          'error-invalid-attributes': 'email,preferredLanguage',
          'error-type': 'error-invalid-attributes',
        },
      });
  });

  it('should convert other error responses directly for a fallback', done => {
    http.get('some').subscribe(fail, error => {
      expect(error).toMatchInlineSnapshot(`
        Object {
          "error": "some other format",
          "key": "value",
          "name": "HttpErrorResponse",
          "status": 400,
        }
      `);
      done();
    });

    httpController.expectOne('some').flush(
      {
        error: 'some other format',
        key: 'value',
      },
      {
        status: 400,
        statusText: 'Bad Request',
      }
    );
  });
});

describe('Icm Error Mapper Interceptor', () => {
  let httpController: HttpTestingController;
  let http: HttpClient;

  class GrabAllErrorHandler implements SpecialHttpErrorHandler {
    test(): boolean {
      return true;
    }
    // tslint:disable-next-line: ban-types
    map(error: HttpErrorResponse, request: HttpRequest<unknown>): Partial<HttpError> {
      return {
        message: `${request.method}:${error.error}`,
      };
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ICMErrorMapperInterceptor, multi: true },
        { provide: SPECIAL_HTTP_ERROR_HANDLER, useClass: GrabAllErrorHandler, multi: true },
      ],
    });

    httpController = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should include provided error handlers for mapping', done => {
    http.get('some').subscribe(fail, error => {
      expect(error).toMatchInlineSnapshot(`
        Object {
          "message": "GET:Test",
          "name": "HttpErrorResponse",
          "status": 400,
        }
      `);
      done();
    });

    httpController.expectOne('some').flush('Test', {
      status: 400,
      statusText: 'Bad Request',
    });
  });
});
