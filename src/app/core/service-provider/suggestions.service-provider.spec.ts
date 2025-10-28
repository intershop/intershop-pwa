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
    it('should return SuggestService when Sparque config is not available', () => {
      configureTestBed();

      const result = suggestionsServiceProvider.get();

      expect(result).toBe(instance(suggestServiceMock));
    });

    it('should return SuggestService when Sparque config exists but no features are defined', () => {
      configureTestBed({ apiKey: 'test-key' });

      const result = suggestionsServiceProvider.get();

      expect(result).toBe(instance(suggestServiceMock));
    });

    it('should return SuggestService when Sparque config exists but suggestions feature is not in features', () => {
      configureTestBed({ apiKey: 'test-key', features: ['other_feature'] });

      const result = suggestionsServiceProvider.get();

      expect(result).toBe(instance(suggestServiceMock));
    });

    it('should return SparqueSuggestionsService when Sparque config exists and suggestions feature is enabled', () => {
      configureTestBed({ apiKey: 'test-key', features: ['suggestions'] });

      const result = suggestionsServiceProvider.get();

      expect(result).toBe(instance(sparqueSuggestionsServiceMock));
    });

    it('should return SparqueSuggestionsService when Sparque config exists and multiple features including suggestions are enabled', () => {
      configureTestBed({ apiKey: 'test-key', features: ['search', 'suggestions'] });

      const result = suggestionsServiceProvider.get();

      expect(result).toBe(instance(sparqueSuggestionsServiceMock));
    });

    it('should return SuggestService when Sparque config is null', () => {
      configureTestBed(undefined);

      const result = suggestionsServiceProvider.get();

      expect(result).toBe(instance(suggestServiceMock));
    });

    it('should return SuggestService when empty Sparque config object is provided', () => {
      configureTestBed({});

      const result = suggestionsServiceProvider.get();

      expect(result).toBe(instance(suggestServiceMock));
    });

    it('should return SuggestService when config is falsy value', () => {
      configureTestBed(false);

      const result = suggestionsServiceProvider.get();

      expect(result).toBe(instance(suggestServiceMock));
    });

    it('should return SuggestService when config is zero', () => {
      configureTestBed(0);

      const result = suggestionsServiceProvider.get();

      expect(result).toBe(instance(suggestServiceMock));
    });

    it('should return SuggestService when config is empty string', () => {
      configureTestBed('');

      const result = suggestionsServiceProvider.get();

      expect(result).toBe(instance(suggestServiceMock));
    });

    it('should return SuggestService when Sparque config has empty features array', () => {
      configureTestBed({ apiKey: 'test-key', features: [] });

      const result = suggestionsServiceProvider.get();

      expect(result).toBe(instance(suggestServiceMock));
    });

    it('should prioritize Sparque service when both config and features are properly set', () => {
      configureTestBed({
        apiKey: 'test-key',
        baseUrl: 'https://api.sparque.ai',
        features: ['suggestions'],
      });

      const result = suggestionsServiceProvider.get();

      expect(result).toBe(instance(sparqueSuggestionsServiceMock));
      expect(result).not.toBe(instance(suggestServiceMock));
    });

    it('should return SuggestService when features array exists but does not include sparque_suggestions', () => {
      configureTestBed({ apiKey: 'test-key', features: ['other_feature', 'another_feature'] });

      const result = suggestionsServiceProvider.get();

      expect(result).toBe(instance(suggestServiceMock));
    });
  });
});
