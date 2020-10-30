import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';

import { Requisition } from '../../models/requisition/requisition.model';
import { RequisitionsService } from '../../services/requisitions/requisitions.service';
import { RequisitionManagementStoreModule } from '../requisition-management-store.module';

import { loadRequisition, loadRequisitionSuccess, loadRequisitions } from './requisitions.actions';
import { RequisitionsEffects } from './requisitions.effects';

const requisitions = [
  {
    id: 'testUUID',
    requisitionNo: '0001',
    user: { firstName: 'Patricia', lastName: 'Miller' },
    approval: { status: 'pending' },
    lineItems: [
      {
        id: 'BIID',
        name: 'NAME',
        position: 1,
        quantity: { value: 1 },
        price: undefined,
        productSKU: 'SKU',
      } as LineItem,
    ],
  },
  {
    id: 'testUUID2',
    requisitionNo: '0002',
    user: { firstName: 'Jack', lastName: 'Miller' },
    approval: { status: 'pending' },
  },
] as Requisition[];

describe('Requisitions Effects', () => {
  let actions$: Observable<Action>;
  let effects: RequisitionsEffects;
  let requisitionsService: RequisitionsService;

  beforeEach(() => {
    requisitionsService = mock(RequisitionsService);
    when(requisitionsService.getRequisitions(anything(), anything())).thenReturn(of(requisitions));
    when(requisitionsService.getRequisition(anyString())).thenReturn(of(requisitions[0]));

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(),
        CustomerStoreModule.forTesting('user'),
        RequisitionManagementStoreModule.forTesting('requisitions'),
      ],
      providers: [
        RequisitionsEffects,
        provideMockActions(() => actions$),
        { provide: RequisitionsService, useFactory: () => instance(requisitionsService) },
      ],
    });

    effects = TestBed.inject(RequisitionsEffects);
  });

  describe('loadRequisitions$', () => {
    it('should call the service for retrieving requisitions', done => {
      actions$ = of(loadRequisitions({ view: 'buyer', status: 'pending' }));

      effects.loadRequisitions$.subscribe(() => {
        verify(requisitionsService.getRequisitions(anything(), anything())).once();
        done();
      });
    });

    it('should retrieve requisitions when triggered', done => {
      actions$ = of(loadRequisitions({ view: 'buyer', status: 'pending' }));

      effects.loadRequisitions$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Requisitions API] Load Requisitions Success:
            requisitions: [{"id":"testUUID","requisitionNo":"0001","user":{"firstName"...
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
});
