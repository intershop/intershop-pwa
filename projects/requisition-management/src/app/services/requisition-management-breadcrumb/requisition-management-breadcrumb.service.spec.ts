import { Component, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Route, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

import { RequisitionManagementFacade } from '../../facades/requisition-management.facade';
import { RequisitionView } from '../../models/requisition/requisition.model';
import { routes } from '../../pages/requisition-management-routing.module';
import { RequisitionManagementStoreModule } from '../../store/requisition-management-store.module';

import { RequisitionManagementBreadcrumbService } from './requisition-management-breadcrumb.service';

// tslint:disable-next-line: no-any
function adaptRoutes(rts: Route[], cmp: Type<any>): Route[] {
  return rts.map(r => ({
    ...r,
    path: 'requisitions/' + r.path,
    component: r.component && cmp,
  }));
}

describe('Requisition Management Breadcrumb Service', () => {
  let requisitionManagementBreadcrumbService: RequisitionManagementBreadcrumbService;
  let router: Router;
  let reqFacade: RequisitionManagementFacade;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}
    reqFacade = mock(RequisitionManagementFacade);
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['router', 'configuration']),
        RequisitionManagementStoreModule.forTesting('requisitions'),
        RouterTestingModule.withRoutes([
          ...adaptRoutes(routes, DummyComponent),
          { path: '**', component: DummyComponent },
        ]),
        TranslateModule.forRoot(),
      ],
      providers: [{ provide: RequisitionManagementFacade, useFactory: () => instance(reqFacade) }],
    });
    requisitionManagementBreadcrumbService = TestBed.inject(RequisitionManagementBreadcrumbService);
    router = TestBed.inject(Router);

    when(reqFacade.selectedRequisition$).thenReturn(of({ id: '65435435', requisitionNo: '12345' } as RequisitionView));

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
      it('should set breadcrumb for requisitions buyer list view', done => {
        router.navigateByUrl('/requisitions/buyer');
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

      it('should set breadcrumb for requisitions approver list view', done => {
        router.navigateByUrl('/requisitions/approver');
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

    it('should set breadcrumb for requisitions buyer detail view', done => {
      router.navigateByUrl('/requisitions/buyer/12345;requisitionStatus=pending');
      requisitionManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
        expect(breadcrumbData).toMatchInlineSnapshot(`
          Array [
            Object {
              "key": "account.requisitions.requisitions",
              "link": Array [
                "/my-account/buyer",
                Object {
                  "requisitionStatus": "pending",
                },
              ],
            },
            Object {
              "text": "approval.details.breadcrumb.order.label - 12345",
            },
          ]
        `);
        done();
      });
    });

    it('should set breadcrumb for requisitions buyer detail view', done => {
      router.navigateByUrl('/requisitions/approver/12345;requisitionStatus=rejected');
      requisitionManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
        expect(breadcrumbData).toMatchInlineSnapshot(`
          Array [
            Object {
              "key": "account.requisitions.approvals",
              "link": Array [
                "/my-account/approver",
                Object {
                  "requisitionStatus": "rejected",
                },
              ],
            },
            Object {
              "text": "approval.details.breadcrumb.order.label - 12345",
            },
          ]
        `);
        done();
      });
    });
  });
});
