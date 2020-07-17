import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';

import { Requisition } from '../../models/requisition/requisition.model';
import { RequisitionsService } from '../../services/requisitions/requisitions.service';
import { RequisitionManagementStoreModule } from '../requisition-management-store.module';

import { loadRequisitions } from './requisitions.actions';
import { RequisitionsEffects } from './requisitions.effects';

const requisitions = [
  { id: 'testUUID', requisitionNo: '0001', user: 'test@user.com', approvalStatus: 'pending' },
  { id: 'testUUID2', requisitionNo: '0002', user: 'test@user.com', approvalStatus: 'pending' },
] as Requisition[];

describe('Requisitions Effects', () => {
  let actions$: Observable<Action>;
  let effects: RequisitionsEffects;
  let requisitionsService: RequisitionsService;

  beforeEach(() => {
    requisitionsService = mock(RequisitionsService);
    when(requisitionsService.getRequisitions()).thenReturn(of(requisitions));

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
      actions$ = of(loadRequisitions());

      effects.loadRequisitions$.subscribe(() => {
        verify(requisitionsService.getRequisitions()).once();
        done();
      });
    });

    it('should retrieve users when triggered', done => {
      actions$ = of(loadRequisitions());

      effects.loadRequisitions$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Requisitions API] Load Requisitions Success:
            requisitions: [{"id":"testUUID","requisitionNo":"0001","user":"test@user.c...
        `);
        done();
      });
    });
  });
});
