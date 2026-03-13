import { Component, Type } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Route, Router, provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';

import { RequisitionManagementFacade } from '../../facades/requisition-management.facade';
import { Requisition } from '../../models/requisition/requisition.model';
import { routes } from '../../pages/requisition-management-routing.module';

import { RequisitionManagementBreadcrumbService } from './requisition-management-breadcrumb.service';

function adaptRoutes(rts: Route[], cmp: Type<Component>): Route[] {
  return rts.map(r => ({
    ...r,
    loadChildren: undefined,
    path: `requisitions/${r.path}`,
    component: (r.component || r.loadChildren) && cmp,
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
      imports: [CoreStoreModule.forTesting(['router', 'configuration']), TranslateModule.forRoot()],
      providers: [
        { provide: RequisitionManagementFacade, useFactory: () => instance(reqFacade) },
        provideRouter([...adaptRoutes(routes, DummyComponent), { path: '**', component: DummyComponent }]),
      ],
    });
    requisitionManagementBreadcrumbService = TestBed.inject(RequisitionManagementBreadcrumbService);
    router = TestBed.inject(Router);

    // Setup default mock for most tests
    when(reqFacade.selectedRequisition$).thenReturn(of({ id: '65435435', requisitionNo: '12345' } as Requisition));

    router.initialNavigation();
  });

  it('should be created', () => {
    expect(requisitionManagementBreadcrumbService).toBeTruthy();
  });

  describe('breadcrumb$', () => {
    describe('unrelated routes', () => {
      it('should not report a breadcrumb for unrelated routes', fakeAsync(() => {
        router.navigateByUrl('/foobar');
        requisitionManagementBreadcrumbService
          .breadcrumb$('/my-account')
          .subscribe({ next: fail, error: fail, complete: fail });

        tick(2000);
      }));
    });

    describe('requisition management routes', () => {
      it('should set breadcrumb for requisitions buyer list view', done => {
        router.navigateByUrl('/requisitions/buyer');
        requisitionManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
          expect(breadcrumbData).toMatchInlineSnapshot(`
            [
              {
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
            [
              {
                "key": "account.requisitions.approvals",
              },
            ]
          `);
          done();
        });
      });
    });

    it('should set breadcrumb for requisitions buyer detail view', done => {
      router.navigateByUrl('/requisitions/buyer/12345;status=pending');
      requisitionManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
        expect(breadcrumbData).toMatchInlineSnapshot(`
          [
            {
              "key": "account.requisitions.requisitions",
              "link": [
                "/my-account/buyer",
                {
                  "status": "pending",
                },
              ],
            },
            {
              "text": "approval.details.breadcrumb.order.label - 12345",
            },
          ]
        `);
        done();
      });
    });

    it('should set breadcrumb for requisitions approver detail view', done => {
      router.navigateByUrl('/requisitions/approver/12345;status=rejected');
      requisitionManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
        expect(breadcrumbData).toMatchInlineSnapshot(`
          [
            {
              "key": "account.requisitions.approvals",
              "link": [
                "/my-account/approver",
                {
                  "status": "rejected",
                },
              ],
            },
            {
              "text": "approval.details.breadcrumb.order.label - 12345",
            },
          ]
        `);
        done();
      });
    });

    it('should set breadcrumb for requisitions of buyer detail view', done => {
      router.navigateByUrl('/requisitions/buyer/12345;status=pending');
      requisitionManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
        expect(breadcrumbData).toMatchInlineSnapshot(`
          [
            {
              "key": "account.requisitions.requisitions",
              "link": [
                "/my-account/buyer",
                {
                  "status": "pending",
                },
              ],
            },
            {
              "text": "approval.details.breadcrumb.order.label - 12345",
            },
          ]
        `);
        done();
      });
    });

    it('should set breadcrumb for recurring order requisitions of buyer detail view', done => {
      when(reqFacade.selectedRequisition$).thenReturn(
        of({
          id: '65435435',
          recurrence: { id: 'recurrence1' },
          recurringOrderDocumentNo: 'REC-789',
        } as unknown as Requisition)
      );

      router.navigateByUrl('/requisitions/buyer/12345;status=pending');
      requisitionManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
        expect(breadcrumbData).toMatchInlineSnapshot(`
          [
            {
              "key": "account.requisitions.requisitions",
              "link": [
                "/my-account/buyer",
                {
                  "status": "pending",
                },
              ],
            },
            {
              "text": "approval.details.breadcrumb.order.label - REC-789",
            },
          ]
        `);
        done();
      });
    });

    it('should set breadcrumb for recurring order requisitions of approval detail view', done => {
      when(reqFacade.selectedRequisition$).thenReturn(
        of({
          id: '65435435',
          recurrence: { id: 'recurrence1' },
          recurringOrderDocumentNo: 'REC-789',
        } as unknown as Requisition)
      );

      router.navigateByUrl('/requisitions/approver/12345;status=rejected');
      requisitionManagementBreadcrumbService.breadcrumb$('/my-account').subscribe(breadcrumbData => {
        expect(breadcrumbData).toMatchInlineSnapshot(`
          [
            {
              "key": "account.requisitions.approvals",
              "link": [
                "/my-account/approver",
                {
                  "status": "rejected",
                },
              ],
            },
            {
              "text": "approval.details.breadcrumb.order.label - REC-789",
            },
          ]
        `);
        done();
      });
    });
  });
});
