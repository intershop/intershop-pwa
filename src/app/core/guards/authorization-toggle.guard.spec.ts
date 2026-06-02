import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AuthorizationToggleService } from 'ish-core/utils/authorization-toggle/authorization-toggle.service';

import { authorizationToggleGuard } from './authorization-toggle.guard';

describe('Authorization Toggle Guard', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthorizationToggleService,
          useValue: {
            isAuthorizedTo: (permission: string) => of(permission === 'DO_THIS'),
          },
        },
        provideRouter([
          {
            path: 'error',
            children: [],
          },
          {
            path: 'page1',
            children: [],
            canActivate: [authorizationToggleGuard],
            data: { permission: 'DO_THIS' },
          },
          {
            path: 'page2',
            children: [],
            canActivate: [authorizationToggleGuard],
            data: { permission: 'DO_THAT' },
          },
        ]),
      ],
    });

    router = TestBed.inject(Router);
  });

  it('should navigate successfully if user has permission', fakeAsync(() => {
    router.navigate(['/page1']);
    tick(2000);

    expect(router.url).toMatchInlineSnapshot(`"/page1"`);
  }));

  it('should not navigate if user is not authorized', fakeAsync(() => {
    router.navigate(['/page2']);
    tick(2000);

    expect(router.url).toMatchInlineSnapshot(`"/error?error=missing-permission&value=DO_THAT"`);
  }));
});
