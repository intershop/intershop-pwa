import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { FeatureToggleGuard, FeatureToggleModule } from 'ish-core/feature-toggle.module';

describe('Feature Toggle Guard', () => {
  let router: Router;

  beforeEach(() => {
    @Component({ template: 'dummy', changeDetection: ChangeDetectionStrategy.OnPush })
    class DummyComponent {}

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        FeatureToggleModule.forTesting('feature1'),
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
      ],
    });

    router = TestBed.inject(Router);
  });

  it('should navigate to activated features successfully', fakeAsync(() => {
    router.navigate(['/feature1']);
    tick(2000);

    expect(router.url).toMatchInlineSnapshot(`"/feature1"`);
  }));

  it('should not navigate to deactivated features', fakeAsync(() => {
    router.navigate(['/feature2']);
    tick(2000);

    expect(router.url).toMatchInlineSnapshot(`"/error?error=feature-deactivated&value=feature2"`);
  }));
});
