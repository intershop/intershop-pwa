import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { LineItem } from 'ish-core/models/line-item/line-item.model';

import { Requisition } from '../../models/requisition/requisition.model';
import { RequisitionsService } from '../../services/requisitions/requisitions.service';

import {
  loadRequisition,
  loadRequisitionSuccess,
  loadRequisitions,
  updateRequisitionStatus,
} from './requisitions.actions';
import { RequisitionsEffects } from './requisitions.effects';

@Component({ template: 'dummy' })
class DummyComponent {}

const requisitions = [
  {
    id: 'testUUID',
    requisitionNo: '0001',
    user: { firstName: 'Patricia', lastName: 'Miller' },
    approval: { status: 'pending', statusCode: 'PENDING' },
    lineItems: [
      ({
        id: 'BIID',
        name: 'NAME',
        position: 1,
        quantity: { value: 1 },
        price: undefined,
        productSKU: 'SKU',
      } as unknown) as LineItem,
    ],
  },
  {
    id: 'testUUID2',
    requisitionNo: '0002',
    user: { firstName: 'Jack', lastName: 'Miller' },
    approval: { status: 'pending', statusCode: 'PENDING' },
  },
] as Requisition[];

describe('Requisitions Effects', () => {
  let actions$: Observable<Action>;
  let effects: RequisitionsEffects;
  let requisitionsService: RequisitionsService;
  let location: Location;

  beforeEach(() => {
    requisitionsService = mock(RequisitionsService);
    when(requisitionsService.getRequisitions(anything(), anything())).thenReturn(of(requisitions));
    when(requisitionsService.getRequisition(anyString())).thenReturn(of(requisitions[0]));
    when(requisitionsService.updateRequisitionStatus(anyString(), anyString(), anyString())).thenReturn(
      of(requisitions[0])
    );

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [RouterTestingModule.withRoutes([{ path: '**', component: DummyComponent }])],
      providers: [
        RequisitionsEffects,
        provideMockActions(() => actions$),
        { provide: RequisitionsService, useFactory: () => instance(requisitionsService) },
      ],
    });

    effects = TestBed.inject(RequisitionsEffects);
    location = TestBed.inject(Location);
  });

  describe('loadRequisitions$', () => {
    it('should call the service for retrieving requisitions', done => {
      actions$ = of(loadRequisitions({ view: 'buyer', status: 'PENDING' }));

      effects.loadRequisitions$.subscribe(() => {
        verify(requisitionsService.getRequisitions(anything(), anything())).once();
        done();
      });
    });

    it('should retrieve requisitions when triggered', done => {
      actions$ = of(loadRequisitions({ view: 'buyer', status: 'PENDING' }));

      effects.loadRequisitions$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Requisitions API] Load Requisitions Success:
            requisitions: [{"id":"testUUID","requisitionNo":"0001","user":{"firstName"...
            view: "buyer"
            status: "PENDING"
        `);
        done();
      });
    });
  });

  describe('loadRequisition$', () => {
    it('should call the service for retrieving a requisition', done => {
      actions$ = of(loadRequisition({ requisitionId: '12345' }));

      effects.loadRequisition$.subscribe(() => {
        verify(requisitionsService.getRequisition('12345')).once();
        done();
      });
    });

    it('should retrieve a requisition when triggered', done => {
      actions$ = of(loadRequisition({ requisitionId: '12345' }));

      effects.loadRequisition$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Requisitions API] Load Requisition Success:
            requisition: {"id":"testUUID","requisitionNo":"0001","user":{"firstName":...
        `);
        done();
      });
    });

    it('should load products of a requisition if there are not loaded yet', done => {
      actions$ = of(loadRequisitionSuccess({ requisition: requisitions[0] }));

      effects.loadProductsForSelectedRequisition$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Products Internal] Load Product if not Loaded:
            sku: "SKU"
            level: 2
        `);
        done();
      });
    });
  });

  describe('updateRequisitionStatus$', () => {
    beforeEach(() => {
      actions$ = of(
        updateRequisitionStatus({ requisitionId: '4711', status: 'APPROVED', approvalComment: 'test comment' })
      );
    });

    it('should call the service for updating the status of a requisition', done => {
      effects.updateRequisitionStatus$.subscribe(() => {
        verify(requisitionsService.updateRequisitionStatus('4711', 'APPROVED', 'test comment')).once();
        done();
      });
    });

    it('should retrieve the requisition after updating the status', done => {
      effects.updateRequisitionStatus$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Requisitions API] Update Requisition Status Success:
            requisition: {"id":"testUUID","requisitionNo":"0001","user":{"firstName":...
        `);
        done();
      });
    });

    it('should redirect to listing', done => {
      effects.updateRequisitionStatus$.subscribe(() => {
        expect(location.path()).toMatchInlineSnapshot(`"/account/requisitions/approver/testUUID;status=PENDING"`);
        done();
      });
    });
  });
});
