import { TestBed } from '@angular/core/testing';
import * as using from 'jasmine-data-provider';
import { FeatureToggleModule } from '../../feature-toggle.module';
import { FEATURE_TOGGLES } from '../configurations/injection-keys';
import { FeatureToggleService } from './feature-toggle.service';

describe('Feature Toggle Service', () => {
  describe('without features defined', () => {
    let featureToggle: FeatureToggleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [FeatureToggleService, { provide: FEATURE_TOGGLES, useValue: undefined }],
      });
      featureToggle = TestBed.get(FeatureToggleService);
    });

    it('should report feature as activated, when no settings are defined', () => {
      expect(featureToggle.enabled('something')).toBeTrue();
    });
  });

  describe('configured with injection key', () => {
    let featureToggle: FeatureToggleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [FeatureToggleService, { provide: FEATURE_TOGGLES, useValue: { feature1: true, feature2: false } }],
      });
      featureToggle = TestBed.get(FeatureToggleService);
    });

    using(
      () => [
        { feature: 'feature1', expected: true },
        { feature: 'feature2', expected: false },
        { feature: 'feature3', expected: true },
      ],
      slice => {
        it(`should have ${slice.feature} == ${slice.expected} when asked`, () => {
          expect(featureToggle.enabled(slice.feature)).toBe(slice.expected);
        });
      }
    );
  });

  describe('configured with helper function', () => {
    let featureToggle: FeatureToggleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FeatureToggleModule.testingFeatures({ feature1: true, feature2: false })],
      });
      featureToggle = TestBed.get(FeatureToggleService);
    });

    using(
      () => [
        { feature: 'feature1', expected: true },
        { feature: 'feature2', expected: false },
        { feature: 'feature3', expected: true },
      ],
      slice => {
        it(`should have ${slice.feature} == ${slice.expected} when asked`, () => {
          expect(featureToggle.enabled(slice.feature)).toBe(slice.expected);
        });
      }
    );
  });
});
