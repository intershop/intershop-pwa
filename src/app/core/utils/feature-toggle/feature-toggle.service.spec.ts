import { TestBed } from '@angular/core/testing';
import * as using from 'jasmine-data-provider';

import { FeatureToggleModule, FeatureToggleService } from 'ish-core/feature-toggle.module';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

describe('Feature Toggle Service', () => {
  describe('without features defined', () => {
    let featureToggle: FeatureToggleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FeatureToggleModule, ngrxTesting({ reducers: { configuration: configurationReducer } })],
      });
      featureToggle = TestBed.get(FeatureToggleService);
    });

    it('should report feature as deactivated, when no settings are defined', () => {
      expect(featureToggle.enabled('something')).toBeFalse();
    });
  });

  describe('configured with feature list', () => {
    let featureToggle: FeatureToggleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          FeatureToggleModule,
          ngrxTesting({
            reducers: { configuration: configurationReducer },
            config: {
              initialState: { configuration: { features: ['feature1'] } },
            },
          }),
        ],
      });
      featureToggle = TestBed.get(FeatureToggleService);
    });

    using(
      () => [{ feature: 'feature1', expected: true }, { feature: 'feature2', expected: false }],
      slice => {
        it(`should have ${slice.feature} == ${slice.expected} when asked`, () => {
          expect(featureToggle.enabled(slice.feature)).toBe(slice.expected);
        });
      }
    );
  });
});
