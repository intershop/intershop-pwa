import { Type } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Route, Router, provideRouter } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { AuthorizationToggleService } from 'ish-core/authorization-toggle';
import { FeatureToggleService } from 'ish-core/feature-toggle';
import { CostCenter } from 'ish-core/models/cost-center/cost-center.model';
import { CoreStoreProviders } from 'ish-core/store/core/core-store.providers';

import { B2bUser } from '../../models/b2b-user/b2b-user.model';
import { routes } from '../../pages/organization-management.routes';
import { loadCostCenterSuccess } from '../../store/cost-centers';
import { OrganizationManagementStoreProviders } from '../../store/organization-management-store.providers';
import { loadUserSuccess } from '../../store/users';

import { OrganizationManagementBreadcrumbService } from './organization-management-breadcrumb.service';

function adaptRoutes(rts: Route[], cmp: Type<unknown>): Route[] {
  return rts.map(r => ({
    ...r,
    loadChildren: undefined,
    loadComponent: undefined,
    component: (r.component || r.loadChildren || r.loadComponent) && cmp,
    children: r.children && adaptRoutes(r.children, cmp),
  }));
}

describe('Organization Management Breadcrumb Service', () => {
  let organizationManagementBreadcrumbService: OrganizationManagementBreadcrumbService;
  let router: Router;
  let store: Store;

  beforeEach(() => {
    class DummyComponent {}
    TestBed.configureTestingModule({
      imports: [
        CoreStoreProviders.forTesting(['router', 'configuration']),
        OrganizationManagementStoreProviders.forTesting('users', 'costCenters'),
      ],
      providers: [
        {
          provide: AuthorizationToggleService,
          useValue: {
            isAuthorizedTo: () => of(true),
          },
        },
        {
          provide: FeatureToggleService,
          useValue: {
            enabled: () => true,
            enabled$: () => of(true),
          },
        },
        provideRouter([...adaptRoutes(routes, DummyComponent), { path: '**', component: DummyComponent }]),
        provideTranslateService(),
      ],
    });

    organizationManagementBreadcrumbService = TestBed.inject(OrganizationManagementBreadcrumbService);
    router = TestBed.inject(Router);
    store = TestBed.inject(Store);

    router.initialNavigation();
  });

  it('should be created', () => {
    expect(organizationManagementBreadcrumbService).toBeTruthy();
  });

  describe('breadcrumb$', () => {
    describe('unrelated routes', () => {
      it('should not report a breadcrumb for unrelated routes', fakeAsync(() => {
        router.navigateByUrl('/foobar');

        organizationManagementBreadcrumbService
          .breadcrumb$('/my-account')
          .subscribe({ next: fail, error: fail, complete: fail });

        tick(2000);
      }));
    });

    describe('company settings routes', () => {
      it('should set breadcrumb for company setting page', done => {
        router.navigateByUrl('/settings');

        organizationManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
          expect(breadcrumbData).toMatchInlineSnapshot(`
            [
              {
                "key": "account.organization.org_settings",
              },
            ]
          `);
          done();
        });
      });

      it('should set breadcrumb for company edit page', done => {
        router.navigateByUrl('/settings/company');

        organizationManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
          expect(breadcrumbData).toMatchInlineSnapshot(`
            [
              {
                "key": "account.organization.org_settings",
                "link": "/my-account/settings",
              },
              {
                "key": "account.company_profile.heading",
              },
            ]
          `);
          done();
        });
      });
    });

    describe('user management routes', () => {
      it('should set breadcrumb for users list view', done => {
        router.navigateByUrl('/users');

        organizationManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
          expect(breadcrumbData).toMatchInlineSnapshot(`
            [
              {
                "key": "account.organization.user_management",
              },
            ]
          `);
          done();
        });
      });

      it('should set breadcrumb for user create page', done => {
        router.navigateByUrl('/users/create');

        organizationManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
          expect(breadcrumbData).toMatchInlineSnapshot(`
            [
              {
                "key": "account.organization.user_management",
                "link": "/my-account/users",
              },
              {
                "key": "account.user.breadcrumbs.new_user.text",
              },
            ]
          `);
          done();
        });
      });

      it('should set breadcrumb for user detail page', done => {
        store.dispatch(loadUserSuccess({ user: { login: '1', firstName: 'John', lastName: 'Doe' } as B2bUser }));
        router.navigateByUrl('/users/1');

        organizationManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
          expect(breadcrumbData).toMatchInlineSnapshot(`
            [
              {
                "key": "account.organization.user_management",
                "link": "/my-account/users",
              },
              {
                "text": "account.organization.user_management.user_detail.breadcrumb - John Doe",
              },
            ]
          `);
          done();
        });
      });

      it('should set breadcrumb for user detail edit page', done => {
        store.dispatch(loadUserSuccess({ user: { login: '1', firstName: 'John', lastName: 'Doe' } as B2bUser }));
        router.navigateByUrl('/users/1/profile');

        organizationManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
          expect(breadcrumbData).toMatchInlineSnapshot(`
            [
              {
                "key": "account.organization.user_management",
                "link": "/my-account/users",
              },
              {
                "link": "/my-account/users/1",
                "text": "account.organization.user_management.user_detail.breadcrumb - John Doe",
              },
              {
                "key": "account.user.update_profile.heading",
              },
            ]
          `);
          done();
        });
      });

      it('should set breadcrumb for user role edit page', done => {
        store.dispatch(loadUserSuccess({ user: { login: '1', firstName: 'John', lastName: 'Doe' } as B2bUser }));
        router.navigateByUrl('/users/1/roles');

        organizationManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
          expect(breadcrumbData).toMatchInlineSnapshot(`
            [
              {
                "key": "account.organization.user_management",
                "link": "/my-account/users",
              },
              {
                "link": "/my-account/users/1",
                "text": "account.organization.user_management.user_detail.breadcrumb - John Doe",
              },
              {
                "key": "account.user.update_roles.heading",
              },
            ]
          `);
          done();
        });
      });

      it('should set breadcrumb for user budget edit page', done => {
        store.dispatch(loadUserSuccess({ user: { login: '1', firstName: 'John', lastName: 'Doe' } as B2bUser }));
        router.navigateByUrl('/users/1/budget');

        organizationManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
          expect(breadcrumbData).toMatchInlineSnapshot(`
            [
              {
                "key": "account.organization.user_management",
                "link": "/my-account/users",
              },
              {
                "link": "/my-account/users/1",
                "text": "account.organization.user_management.user_detail.breadcrumb - John Doe",
              },
              {
                "key": "account.user.update_budget.heading",
              },
            ]
          `);
          done();
        });
      });
    });

    describe('cost center management routes', () => {
      it('should set breadcrumb for cost centers list view', done => {
        router.navigateByUrl('/cost-centers');

        organizationManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
          expect(breadcrumbData).toMatchInlineSnapshot(`
            [
              {
                "key": "account.organization.cost_center_management",
              },
            ]
          `);
          done();
        });
      });

      it('should set breadcrumb for cost center create page', done => {
        router.navigateByUrl('/cost-centers/create');

        organizationManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
          expect(breadcrumbData).toMatchInlineSnapshot(`
            [
              {
                "key": "account.organization.cost_center_management",
                "link": "/my-account/cost-centers",
              },
              {
                "key": "account.costcenter.create.heading",
              },
            ]
          `);
          done();
        });
      });

      it('should set breadcrumb for cost center detail page', done => {
        store.dispatch(
          loadCostCenterSuccess({ costCenter: { id: '1', costCenterId: '100400', name: 'Marketing' } as CostCenter })
        );
        router.navigateByUrl('/cost-centers/1');

        organizationManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
          expect(breadcrumbData).toMatchInlineSnapshot(`
            [
              {
                "key": "account.organization.cost_center_management",
                "link": "/my-account/cost-centers",
              },
              {
                "text": "Marketing",
              },
            ]
          `);
          done();
        });
      });

      it('should set breadcrumb for cost center edit page', done => {
        store.dispatch(
          loadCostCenterSuccess({ costCenter: { id: '1', costCenterId: '100400', name: 'Marketing' } as CostCenter })
        );
        router.navigateByUrl('/cost-centers/1/edit');

        organizationManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
          expect(breadcrumbData).toMatchInlineSnapshot(`
            [
              {
                "key": "account.organization.cost_center_management",
                "link": "/my-account/cost-centers",
              },
              {
                "link": "/my-account/cost-centers/1",
                "text": "Marketing",
              },
              {
                "key": "account.costcenter.details.edit.heading",
              },
            ]
          `);
          done();
        });
      });

      it('should set breadcrumb for cost center buyers page', done => {
        store.dispatch(
          loadCostCenterSuccess({ costCenter: { id: '1', costCenterId: '100400', name: 'Marketing' } as CostCenter })
        );
        router.navigateByUrl('/cost-centers/1/buyers');

        organizationManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
          expect(breadcrumbData).toMatchInlineSnapshot(`
            [
              {
                "key": "account.organization.cost_center_management",
                "link": "/my-account/cost-centers",
              },
              {
                "link": "/my-account/cost-centers/1",
                "text": "Marketing",
              },
              {
                "key": "account.costcenter.details.buyers.heading",
              },
            ]
          `);
          done();
        });
      });
    });
  });
});
