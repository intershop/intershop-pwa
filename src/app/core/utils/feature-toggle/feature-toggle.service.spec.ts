import { TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import * as using from 'jasmine-data-provider';

import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { FeatureToggleModule, FeatureToggleService } from '../../feature-toggle.module';

describe('Feature Toggle Service', () => {
  describe('without features defined', () => {
    let featureToggle: FeatureToggleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FeatureToggleModule, StoreModule.forRoot({ configuration: configurationReducer })],
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
          StoreModule.forRoot(
            { configuration: configurationReducer },
            { initialState: { configuration: { features: ['feature1'] } } }
          ),
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
