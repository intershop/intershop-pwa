import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import * as using from 'jasmine-data-provider';

import { FeatureToggleModule, FeatureToggleService } from 'ish-core/feature-toggle.module';
import { getFeatures } from 'ish-core/store/core/configuration';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

describe('Feature Toggle Service', () => {
  describe('without features defined', () => {
    let featureToggle: FeatureToggleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CoreStoreModule.forTesting(['configuration']), FeatureToggleModule],
      });
      featureToggle = TestBed.inject(FeatureToggleService);
    });

    it('should report feature as deactivated, when no settings are defined', () => {
      expect(featureToggle.enabled('something')).toBeFalse();
    });
  });

  describe('configured with feature list', () => {
    let featureToggle: FeatureToggleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FeatureToggleModule],
        providers: [provideMockStore({ selectors: [{ selector: getFeatures, value: ['feature1'] }] })],
      });
      featureToggle = TestBed.inject(FeatureToggleService);
    });

    using(
      () => [
        { feature: 'always', expected: true },
        { feature: 'never', expected: false },
        { feature: 'feature1', expected: true },
        { feature: 'feature2', expected: false },
      ],
      slice => {
        it(`should have ${slice.feature} == ${slice.expected} when asked`, () => {
          expect(featureToggle.enabled(slice.feature)).toBe(slice.expected);
        });
      }
    );
  });
});
