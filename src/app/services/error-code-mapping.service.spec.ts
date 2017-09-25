import { TranslateService } from "@ngx-translate/core";
import { TestBed } from "@angular/core/testing";
import { anything, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { ErrorCodeMappingService } from "./error-code-mapping.service";
import { Observable } from "rxjs/Rx";
import { inject } from "@angular/core/testing";

fdescribe('ApiService', () => {
    let translateService: TranslateService;

    beforeEach(() => {
        translateService = mock(TranslateService);
        TestBed.configureTestingModule({
            providers: [
                { provide: TranslateService, useFactory: () => instance(translateService) },
                ErrorCodeMappingService
            ]
        });
        when(translateService.get(anything(), anything())).thenReturn(Observable.of('mapped error tranlated string'));
    });
    it('should return mapped error message', inject([ErrorCodeMappingService], (errorCodeMappingService: ErrorCodeMappingService) => {
        const translatedMessage = errorCodeMappingService.getErrorMapping({ errorCode: 'Err001', parameter: [1] });
        expect(translatedMessage).toBe('mapped error tranlated string');
    }));
});