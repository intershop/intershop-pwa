import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { FeatureToggleModule } from '../../feature-toggle.module';

import { FeatureToggleGuard } from './feature-toggle.guard';

describe('Feature Toggle Guard', () => {
  let router: Router;

  beforeEach(() => {
    @Component({ template: 'dummy', changeDetection: ChangeDetectionStrategy.OnPush })
    // tslint:disable-next-line:prefer-mocks-instead-of-stubs-in-tests
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
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
          {
            path: 'feature3',
            component: DummyComponent,
            canActivate: [FeatureToggleGuard],
            data: { feature: 'feature3' },
          },
        ]),
        FeatureToggleModule.testingFeatures({ feature1: true, feature2: false }),
      ],
      providers: [FeatureToggleGuard],
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

  it('should navigate to unhandled features successfully', fakeAsync(() => {
    router.navigate(['/feature3']);
    tick(2000);

    expect(router.url).toEndWith('feature3');
  }));
});
