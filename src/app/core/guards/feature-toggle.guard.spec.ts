import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { FeatureToggleGuard, FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

describe('Feature Toggle Guard', () => {
  let router: Router;

  beforeEach(() => {
    @Component({ template: 'dummy', changeDetection: ChangeDetectionStrategy.OnPush })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        FeatureToggleModule,
        RouterTestingModule.withRoutes([
          {
            path: 'error',
            component: DummyComponent,
          },
          {
            path: 'feature1',
            component: DummyComponent,
            canActivate: [FeatureToggleGuard],
            data: { feature: 'feature1' },
          },
          {
            path: 'feature2',
            component: DummyComponent,
            canActivate: [FeatureToggleGuard],
            data: { feature: 'feature2' },
          },
        ]),
        ngrxTesting({
          reducers: { configuration: configurationReducer },
          config: {
            initialState: { configuration: { features: ['feature1'] } },
          },
        }),
      ],
    });

    router = TestBed.get(Router);
  });

  it('should navigate to activated features successfully', fakeAsync(() => {
    router.navigate(['/feature1']);
    tick(2000);

    expect(router.url).toEndWith('feature1');
  }));

  it('should not navigate to deactivated features', fakeAsync(() => {
    router.navigate(['/feature2']);
    tick(2000);

    expect(router.url).toEndWith('error');
  }));
});
