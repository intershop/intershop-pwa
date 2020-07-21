import { Component, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Route, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

import { routes } from '../../pages/requisition-management-routing.module';

import { RequisitionManagementBreadcrumbService } from './requisition-management-breadcrumb.service';

// tslint:disable-next-line: no-any
function adaptRoutes(rts: Route[], cmp: Type<any>): Route[] {
  return rts.map(r => ({
    ...r,
    component: r.component && cmp,
    children: r.children && adaptRoutes(r.children, cmp),
  }));
}

describe('Requisition Management Breadcrumb Service', () => {
  let requisitionManagementBreadcrumbService: RequisitionManagementBreadcrumbService;
  let router: Router;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['router', 'configuration']),
        RouterTestingModule.withRoutes([
          ...adaptRoutes(routes, DummyComponent),
          { path: '**', component: DummyComponent },
        ]),
        TranslateModule.forRoot(),
      ],
    });
    requisitionManagementBreadcrumbService = TestBed.inject(RequisitionManagementBreadcrumbService);
    router = TestBed.inject(Router);
    router.initialNavigation();
  });

  it('should be created', () => {
    expect(requisitionManagementBreadcrumbService).toBeTruthy();
  });

  describe('breadcrumb$', () => {
    describe('unrelated routes', () => {
      it('should not report a breadcrumb for unrelated routes', done => {
        router.navigateByUrl('/foobar');
        requisitionManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(fail, fail, fail);
        setTimeout(done, 2000);
      });
    });

    describe('requisition management routes', () => {
      it('should set breadcrumb for requisitions list view', done => {
        router.navigateByUrl('/buyer/pending');
        requisitionManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
          expect(breadcrumbData).toMatchInlineSnapshot(`
            Array [
              Object {
                "key": "account.requisitions.requisitions",
              },
            ]
          `);
          done();
        });
      });

      it('should set breadcrumb for requisitions list view', done => {
        router.navigateByUrl('/approver/pending');
        requisitionManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
          expect(breadcrumbData).toMatchInlineSnapshot(`
            Array [
              Object {
                "key": "account.requisitions.approvals",
              },
            ]
          `);
          done();
        });
      });
    });
  });
});
