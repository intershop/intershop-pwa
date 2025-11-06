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
    it('should return undefined when Sparque config is not available', done => {
      configureTestBed();

      recommendationsServiceProvider.get().subscribe(result => {
        expect(result).toBeUndefined();
        done();
      });
    });

    it('should return undefined when Sparque config exists but no features are defined', done => {
      configureTestBed({ apiKey: 'test-key' });

      recommendationsServiceProvider.get().subscribe(result => {
        expect(result).toBeUndefined();
        done();
      });
    });

    it('should return undefined when Sparque config exists but recommendations feature is not in features', done => {
      configureTestBed({ apiKey: 'test-key', features: ['other_feature'] });

      recommendationsServiceProvider.get().subscribe(result => {
        expect(result).toBeUndefined();
        done();
      });
    });

    it('should return SparqueRecommendationsService when Sparque config exists and recommendations feature is enabled', done => {
      configureTestBed({ apiKey: 'test-key', features: ['recommendations'] });

      recommendationsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(sparqueRecommendationsServiceMock));
        done();
      });
    });

    it('should return SparqueRecommendationsService when Sparque config exists and multiple features including recommendations are enabled', done => {
      configureTestBed({ apiKey: 'test-key', features: ['search', 'recommendations'] });

      recommendationsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(sparqueRecommendationsServiceMock));
        done();
      });
    });

    it('should return undefined when Sparque config is null', done => {
      configureTestBed(undefined);

      recommendationsServiceProvider.get().subscribe(result => {
        expect(result).toBeUndefined();
        done();
      });
    });

    it('should return undefined when empty Sparque config object is provided', done => {
      configureTestBed({});

      recommendationsServiceProvider.get().subscribe(result => {
        expect(result).toBeUndefined();
        done();
      });
    });

    it('should return undefined when config is falsy value', done => {
      configureTestBed(false);

      recommendationsServiceProvider.get().subscribe(result => {
        expect(result).toBeUndefined();
        done();
      });
    });

    it('should return undefined when config is zero', done => {
      configureTestBed(0);

      recommendationsServiceProvider.get().subscribe(result => {
        expect(result).toBeUndefined();
        done();
      });
    });

    it('should return undefined when config is empty string', done => {
      configureTestBed('');

      recommendationsServiceProvider.get().subscribe(result => {
        expect(result).toBeUndefined();
        done();
      });
    });

    it('should return undefined when Sparque config has empty features array', done => {
      configureTestBed({ apiKey: 'test-key', features: [] });

      recommendationsServiceProvider.get().subscribe(result => {
        expect(result).toBeUndefined();
        done();
      });
    });

    it('should prioritize Sparque service when both config and features are properly set', done => {
      configureTestBed({
        apiKey: 'test-key',
        baseUrl: 'https://api.sparque.ai',
        features: ['recommendations'],
      });

      recommendationsServiceProvider.get().subscribe(result => {
        expect(result).toBe(instance(sparqueRecommendationsServiceMock));
        expect(result).not.toBeUndefined();
        done();
      });
    });

    it('should return undefined when features array exists but does not include recommendations', done => {
      configureTestBed({ apiKey: 'test-key', features: ['other_feature', 'another_feature'] });

      recommendationsServiceProvider.get().subscribe(result => {
        expect(result).toBeUndefined();
        done();
      });
    });
  });
});
