import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { getFeatures } from 'ish-core/store/core/configuration';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

describe('Feature Toggle Service', () => {
  describe('without features defined', () => {
    let featureToggle: FeatureToggleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CoreStoreModule.forTesting(['configuration'])],
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
        providers: [provideMockStore({ selectors: [{ selector: getFeatures, value: ['feature1'] }] })],
      });
      featureToggle = TestBed.inject(FeatureToggleService);
    });

    it.each([
      ['always', true],
      ['never', false],
      ['feature1', true],
      ['feature2', false],
    ])(`should have %s == %s when asked`, (feature, expected) => {
      expect(featureToggle.enabled(feature)).toBe(expected);
    });
  });
});
