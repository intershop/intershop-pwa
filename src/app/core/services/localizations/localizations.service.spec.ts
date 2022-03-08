import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { anything, capture, instance, mock, verify } from 'ts-mockito';

import { getRestEndpoint } from 'ish-core/store/core/configuration';

import { LocalizationsService } from './localizations.service';

describe('Localizations Service', () => {
  let localizationsService: LocalizationsService;
  let http: HttpTestingController;
  let errorHandler: ErrorHandler;

  beforeEach(() => {
    errorHandler = mock(ErrorHandler);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ErrorHandler, useFactory: () => instance(errorHandler) },
        provideMockStore({ selectors: [{ selector: getRestEndpoint, value: 'https://example.com/rest' }] }),
      ],
    });

    localizationsService = TestBed.inject(LocalizationsService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(localizationsService).toBeTruthy();
  });

  afterEach(() => {
    http.verify();
  });

  describe('getServerTranslations', () => {
    it('should fetch translations for lang from ICM api', done => {
      localizationsService.getServerTranslations('en_US').subscribe({
        next: res => {
          expect(res).toMatchInlineSnapshot(`
            Object {
              "a": "A",
              "b": "B",
            }
          `);
        },
        error: fail,
        complete: done,
      });

      const req = http.expectOne(() => true);
      expect(req.request.url).toMatchInlineSnapshot(`"https://example.com/rest;loc=en_US/localizations"`);
      req.flush({
        'pwa-a': 'A',
        'pwa-b': 'B',
      });
    });

    it('should return empty translations and log error in case of failures', done => {
      localizationsService.getServerTranslations('en_US').subscribe({
        next: res => {
          expect(res).toMatchInlineSnapshot(`Object {}`);
          verify(errorHandler.handleError(anything())).once();
          const [error] = capture<Error>(errorHandler.handleError).last();
          expect(error?.message).toMatchInlineSnapshot(
            `"Http failure response for https://example.com/rest;loc=en_US/localizations?searchKeys=pwa-: 404 Not Found"`
          );
        },
        error: fail,
        complete: done,
      });

      const req = http.expectOne(() => true);
      expect(req.request.url).toMatchInlineSnapshot(`"https://example.com/rest;loc=en_US/localizations"`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });
});
