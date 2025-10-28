import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { instance, mock } from 'ts-mockito';

import { SparqueRecommendationsService } from 'ish-core/services/sparque-recommendations/sparque-recommendations.service';
import { getSparqueConfig } from 'ish-core/store/core/configuration';

import { RecommendationsServiceProvider } from './recommendations.service-provider';

describe('Recommendations Service Provider', () => {
  let recommendationsServiceProvider: RecommendationsServiceProvider;
  let sparqueRecommendationsServiceMock: SparqueRecommendationsService;

  const configureTestBed = (sparqueConfig: unknown = undefined) => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: SparqueRecommendationsService, useFactory: () => instance(sparqueRecommendationsServiceMock) },
        provideMockStore({
          selectors: [{ selector: getSparqueConfig, value: sparqueConfig }],
        }),
      ],
    });

    recommendationsServiceProvider = TestBed.inject(RecommendationsServiceProvider);
  };

  beforeEach(() => {
    sparqueRecommendationsServiceMock = mock(SparqueRecommendationsService);
  });

  it('should be created', () => {
    configureTestBed();
    expect(recommendationsServiceProvider).toBeTruthy();
  });

  describe('get', () => {
    it('should return undefined when Sparque config is not available', () => {
      configureTestBed();

      const result = recommendationsServiceProvider.get();

      expect(result).toBeUndefined();
    });

    it('should return undefined when Sparque config exists but no features are defined', () => {
      configureTestBed({ apiKey: 'test-key' });

      const result = recommendationsServiceProvider.get();

      expect(result).toBeUndefined();
    });

    it('should return undefined when Sparque config exists but recommendations feature is not in features', () => {
      configureTestBed({ apiKey: 'test-key', features: ['other_feature'] });

      const result = recommendationsServiceProvider.get();

      expect(result).toBeUndefined();
    });

    it('should return SparqueRecommendationsService when Sparque config exists and recommendations feature is enabled', () => {
      configureTestBed({ apiKey: 'test-key', features: ['recommendations'] });

      const result = recommendationsServiceProvider.get();

      expect(result).toBe(instance(sparqueRecommendationsServiceMock));
    });

    it('should return SparqueRecommendationsService when Sparque config exists and multiple features including recommendations are enabled', () => {
      configureTestBed({ apiKey: 'test-key', features: ['search', 'recommendations'] });

      const result = recommendationsServiceProvider.get();

      expect(result).toBe(instance(sparqueRecommendationsServiceMock));
    });

    it('should return undefined when Sparque config is null', () => {
      configureTestBed(undefined);

      const result = recommendationsServiceProvider.get();

      expect(result).toBeUndefined();
    });

    it('should return undefined when empty Sparque config object is provided', () => {
      configureTestBed({});

      const result = recommendationsServiceProvider.get();

      expect(result).toBeUndefined();
    });

    it('should return undefined when config is falsy value', () => {
      configureTestBed(false);

      const result = recommendationsServiceProvider.get();

      expect(result).toBeUndefined();
    });

    it('should return undefined when config is zero', () => {
      configureTestBed(0);

      const result = recommendationsServiceProvider.get();

      expect(result).toBeUndefined();
    });

    it('should return undefined when config is empty string', () => {
      configureTestBed('');

      const result = recommendationsServiceProvider.get();

      expect(result).toBeUndefined();
    });

    it('should return undefined when Sparque config has empty features array', () => {
      configureTestBed({ apiKey: 'test-key', features: [] });

      const result = recommendationsServiceProvider.get();

      expect(result).toBeUndefined();
    });

    it('should prioritize Sparque service when both config and features are properly set', () => {
      configureTestBed({
        apiKey: 'test-key',
        baseUrl: 'https://api.sparque.ai',
        features: ['recommendations'],
      });

      const result = recommendationsServiceProvider.get();

      expect(result).toBe(instance(sparqueRecommendationsServiceMock));
      expect(result).not.toBeUndefined();
    });

    it('should return undefined when features array exists but does not include recommendations', () => {
      configureTestBed({ apiKey: 'test-key', features: ['other_feature', 'another_feature'] });

      const result = recommendationsServiceProvider.get();

      expect(result).toBeUndefined();
    });
  });
});
