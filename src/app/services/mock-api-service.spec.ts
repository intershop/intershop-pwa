import { MockApiService, CustomErrorHandler, CacheCustomService } from './';
import { HttpClient } from "@angular/common/http";
import { instance, mock, when, anything } from 'ts-mockito/lib/ts-mockito';
import { Observable } from 'rxjs/Rx';

describe('MockApiService', () => {
    let mockApiService: MockApiService;
    let httpClient: HttpClient;
    let customErrorHandler: CustomErrorHandler;
    let cacheCustomService: CacheCustomService;


    beforeEach(() => {
        httpClient = mock(HttpClient);
        customErrorHandler = mock(CustomErrorHandler);
        cacheCustomService = mock(CacheCustomService);
        const configSettings = {
            exlcudePath: ["categories12"],
            includePath: ["categories/computers12"],
            mockAllRequest: true
        }
        when(cacheCustomService.cacheKeyExists(anything())).thenReturn(true);
        when(cacheCustomService.getCachedData(anything())).thenReturn(configSettings);

        mockApiService = new MockApiService(instance(httpClient), instance(customErrorHandler), instance(cacheCustomService));
    });

    it('should return data returened by http', () => {
        const suggestionData = new ArrayBuffer(3);
        when(httpClient.get(anything(), anything())).thenReturn(Observable.of(suggestionData));
        let suggestionResults;
        mockApiService.get('suggest?SearchTerm=', null, null).subscribe((data) => {
            suggestionResults = suggestionData;
        });
        expect(suggestionResults).toBe(suggestionData);
    });

});