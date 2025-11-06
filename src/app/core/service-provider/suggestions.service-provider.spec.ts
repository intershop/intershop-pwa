import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { instance, mock } from 'ts-mockito';

import { SparqueSuggestionsService } from 'ish-core/services/sparque-suggestions/sparque-suggestions.service';
import { SuggestService } from 'ish-core/services/suggest/suggest.service';
import { getSparqueConfig } from 'ish-core/store/core/configuration';

import { SuggestionsServiceProvider } from './suggestions.service-provider';

describe('Suggestions Service Provider', () => {
  let suggestionsServiceProvider: SuggestionsServiceProvider;
  let suggestServiceMock: SuggestService;
  let sparqueSuggestionsServiceMock: SparqueSuggestionsService;

  const configureTestBed = (sparqueConfig: unknown = undefined) => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: SparqueSuggestionsService, useFactory: () => instance(sparqueSuggestionsServiceMock) },
        { provide: SuggestService, useFactory: () => instance(suggestServiceMock) },
        provideMockStore({
          selectors: [{ selector: getSparqueConfig, value: sparqueConfig }],
        }),
      ],
    });

    suggestionsServiceProvider = TestBed.inject(SuggestionsServiceProvider);
  };

  beforeEach(() => {
    suggestServiceMock = mock(SuggestService);
    sparqueSuggestionsServiceMock = mock(SparqueSuggestionsService);
  });

  it('should be created', () => {
    configureTestBed();
    expect(suggestionsServiceProvider).toBeTruthy();
  });

  describe('get', () => {
    it('should return SuggestService when Sparque config is not available', done => {
      configureTestBed();

      suggestionsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(suggestServiceMock));
        done();
      });
    });

    it('should return SuggestService when Sparque config exists but no features are defined', done => {
      configureTestBed({ apiKey: 'test-key' });

      suggestionsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(suggestServiceMock));
        done();
      });
    });

    it('should return SuggestService when Sparque config exists but suggestions feature is not in features', done => {
      configureTestBed({ apiKey: 'test-key', features: ['other_feature'] });

      suggestionsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(suggestServiceMock));
        done();
      });
    });

    it('should return SparqueSuggestionsService when Sparque config exists and suggestions feature is enabled', done => {
      configureTestBed({ apiKey: 'test-key', features: ['suggestions'] });

      suggestionsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(sparqueSuggestionsServiceMock));
        done();
      });
    });

    it('should return SparqueSuggestionsService when Sparque config exists and multiple features including suggestions are enabled', done => {
      configureTestBed({ apiKey: 'test-key', features: ['search', 'suggestions'] });

      suggestionsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(sparqueSuggestionsServiceMock));
        done();
      });
    });

    it('should return SuggestService when Sparque config is null', done => {
      configureTestBed(undefined);

      suggestionsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(suggestServiceMock));
        done();
      });
    });

    it('should return SuggestService when empty Sparque config object is provided', done => {
      configureTestBed({});

      suggestionsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(suggestServiceMock));
        done();
      });
    });

    it('should return SuggestService when config is falsy value', done => {
      configureTestBed(false);

      suggestionsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(suggestServiceMock));
        done();
      });
    });

    it('should return SuggestService when config is zero', done => {
      configureTestBed(0);

      suggestionsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(suggestServiceMock));
        done();
      });
    });

    it('should return SuggestService when config is empty string', done => {
      configureTestBed('');

      suggestionsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(suggestServiceMock));
        done();
      });
    });

    it('should return SuggestService when Sparque config has empty features array', done => {
      configureTestBed({ apiKey: 'test-key', features: [] });

      suggestionsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(suggestServiceMock));
        done();
      });
    });

    it('should prioritize Sparque service when both config and features are properly set', done => {
      configureTestBed({
        apiKey: 'test-key',
        baseUrl: 'https://api.sparque.ai',
        features: ['suggestions'],
      });

      suggestionsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(sparqueSuggestionsServiceMock));
        expect(result).not.toBe(instance(suggestServiceMock));
        done();
      });
    });

    it('should return SuggestService when features array exists but does not include sparque_suggestions', done => {
      configureTestBed({ apiKey: 'test-key', features: ['other_feature', 'another_feature'] });

      suggestionsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(suggestServiceMock));
        done();
      });
    });
  });
});
