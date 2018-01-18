import { TestBed } from '@angular/core/testing';
import { inject } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs/observable/of';
import { anything, instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { ErrorCodeMappingService } from './error-code-mapping.service';

describe('Error code mapping service', () => {
  let translateService: TranslateService;

  beforeEach(() => {
    translateService = mock(TranslateService);
    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useFactory: () => instance(translateService) },
        ErrorCodeMappingService
      ]
    });
    when(translateService.get('account.register.password.extrainfo.message', anything())).thenCall((key, params) => {
      if (params.hasOwnProperty('0')) {
        return of('mapped error translated string with params');
      } else {
        return of('mapped error translated string');
      }
    });
  });

  it('should return mapped error message with parameter when it is supplied by translate service', inject([ErrorCodeMappingService], (errorCodeMappingService: ErrorCodeMappingService) => {
    const translatedMessage = errorCodeMappingService.getErrorMapping({ errorCode: 'Err001', parameter: [1] });
    expect(translatedMessage).toBe('mapped error translated string with params');
  }));

  it('should return mapped error message when it is supplied by translate service', inject([ErrorCodeMappingService], (errorCodeMappingService: ErrorCodeMappingService) => {
    const translatedMessage = errorCodeMappingService.getErrorMapping({ errorCode: 'Err001' });
    expect(translatedMessage).toBe('mapped error translated string');
  }));
});
