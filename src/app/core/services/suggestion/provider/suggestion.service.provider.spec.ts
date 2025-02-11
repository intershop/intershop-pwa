import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { instance, mock } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';
import { ICMSuggestionService } from 'ish-core/services/icm-suggestion/icm-suggestion.service';
import { SparqueApiService } from 'ish-core/services/sparque-api/sparque-api.service';
import { SparqueSuggestionService } from 'ish-core/services/sparque-suggestion/sparque-suggestion.service';
import { SuggestionService } from 'ish-core/services/suggestion/suggestion.service';
import { getSparqueConfig } from 'ish-core/store/core/configuration';

import { SuggestionServiceProvider } from './suggestion.service.provider';

describe('Suggestion Service Provider', () => {
  let suggestionServiceProvider: SuggestionServiceProvider;
  let store$: MockStore;
  let isSparque = false;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SuggestionService,
          useFactory: () =>
            isSparque ? instance(mock(SparqueSuggestionService)) : instance(mock(ICMSuggestionService)),
        },
        { provide: ApiService, useFactory: () => instance(mock(ApiService)) },
        { provide: SparqueApiService, useFactory: () => instance(mock(SparqueApiService)) },
        provideMockStore({ selectors: [{ selector: getSparqueConfig, value: undefined }] }),
      ],
    });
    suggestionServiceProvider = TestBed.inject(SuggestionServiceProvider);

    store$ = TestBed.inject(MockStore);
  });

  it('should return ICMSuggestionService when Sparque config is false', () => {
    const result = suggestionServiceProvider.get();
    expect(result).toBeInstanceOf(ICMSuggestionService);
  });

  it('should return false when Sparque suggestion service is inactive', () => {
    const result = suggestionServiceProvider.isSparqueSuggestActive();

    expect(result).toBeFalse();
  });

  it('should return SparqueSuggestionService when Sparque config is true', () => {
    isSparque = true;
    store$.overrideSelector(getSparqueConfig, {
      server_url: 'testURL',
      wrapperAPI: 'testAPI',
      WorkspaceName: 'testWorkspace',
      ApiName: 'testApi',
    });

    const result = suggestionServiceProvider.get();

    expect(result).toBeInstanceOf(SparqueSuggestionService);
  });

  it('should return true when Sparque suggestion service is active', () => {
    isSparque = true;
    store$.overrideSelector(getSparqueConfig, {
      server_url: 'testURL',
      wrapperAPI: 'testAPI',
      WorkspaceName: 'testWorkspace',
      ApiName: 'testApi',
    });

    const result = suggestionServiceProvider.isSparqueSuggestActive();

    expect(result).toBeTrue();
  });
});
