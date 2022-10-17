import { Location } from '@angular/common';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { CostCenter, CostCenterBase, CostCenterBuyer } from 'ish-core/models/cost-center/cost-center.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { CostCentersService } from '../../services/cost-centers/cost-centers.service';

import {
  addCostCenter,
  addCostCenterBuyers,
  addCostCenterBuyersFail,
  addCostCenterFail,
  deleteCostCenter,
  deleteCostCenterBuyer,
  deleteCostCenterBuyerFail,
  deleteCostCenterFail,
  loadCostCenter,
  loadCostCenterFail,
  loadCostCenters,
  loadCostCentersFail,
  updateCostCenter,
  updateCostCenterBuyer,
  updateCostCenterBuyerFail,
  updateCostCenterFail,
} from './cost-centers.actions';
import { CostCentersEffects } from './cost-centers.effects';

const costCenters = [
  {
    id: '1',
    costCenterId: '100400',
    name: 'Headquarter',
    budget: { value: 500, currency: 'USD' },
    budgetPeriod: 'monthly',
  },
  { costCenterId: '2' },
] as CostCenter[];

describe('Cost Centers Effects', () => {
  let actions$: Observable<Action>;
  let effects: CostCentersEffects;
  let costCentersService: CostCentersService;
  let location: Location;
  let router: Router;

  beforeEach(() => {
    costCentersService = mock(CostCentersService);
    when(costCentersService.getCostCenters()).thenReturn(of(costCenters));
    when(costCentersService.getCostCenter(anyString())).thenReturn(of(costCenters[0]));
    when(costCentersService.addCostCenter(anything())).thenReturn(of(costCenters[0]));
    when(costCentersService.updateCostCenter(anything())).thenReturn(of(costCenters[0]));
    when(costCentersService.deleteCostCenter(anything())).thenReturn(of({}));
    when(costCentersService.addCostCenterBuyers(anyString(), anything())).thenReturn(of(costCenters[0]));
    when(costCentersService.updateCostCenterBuyer(anyString(), anything())).thenReturn(of(costCenters[0]));
    when(costCentersService.deleteCostCenterBuyer(anyString(), anything())).thenReturn(of(costCenters[0]));

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['router']),
        RouterTestingModule.withRoutes([
          { path: 'cost-centers/:CostCenterId', children: [] },
          { path: '**', children: [] },
        ]),
      ],
      providers: [
        { provide: CostCentersService, useFactory: () => instance(costCentersService) },
        CostCentersEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(CostCentersEffects);
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
  });

  describe('loadCostCenters$', () => {
    it('should call the service for retrieving costCenters', done => {
      actions$ = of(loadCostCenters());

      effects.loadCostCenters$.subscribe(() => {
        verify(costCentersService.getCostCenters()).once();
        done();
      });
    });

    it('should retrieve costCenters when triggered', done => {
      actions$ = of(loadCostCenters());

      effects.loadCostCenters$.subscribe(action => {
        expect(action.type).toMatchInlineSnapshot(`"[CostCenters API] Load Cost Centers Success"`);
        expect(action.payload).toMatchInlineSnapshot(`
          Object {
            "costCenters": Array [
              Object {
                "budget": Object {
                  "currency": "USD",
                  "value": 500,
                },
                "budgetPeriod": "monthly",
                "costCenterId": "100400",
                "id": "1",
                "name": "Headquarter",
              },
              Object {
                "costCenterId": "2",
              },
            ],
          }
        `);
        done();
      });
    });

    it('should dispatch a loadCostCentersFail action on failed cost centers load', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(costCentersService.getCostCenters()).thenReturn(throwError(() => error));

      const action = loadCostCenters();
      const completion = loadCostCentersFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.loadCostCenters$).toBeObservable(expected$);
    });
  });

  describe('loadCostCenter$', () => {
    const costCenterId = costCenters[0].costCenterId;

    it('should call the service for retrieving a costCenter', done => {
      actions$ = of(loadCostCenter({ costCenterId }));

      effects.loadCostCenter$.subscribe(() => {
        verify(costCentersService.getCostCenter(costCenterId)).once();
        done();
      });
    });

    it('should trigger to load the cost center when routeParam CostCenterId exists', done => {
      router.navigate(['cost-centers', '100400']);

      effects.triggerLoadCostCenter$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
                  [CostCenters] Load Cost Center:
                    costCenterId: "100400"
                  `);
        done();
      });
    });

    it('should retrieve a costCenter when triggered', done => {
      actions$ = of(loadCostCenter({ costCenterId }));

      effects.loadCostCenter$.subscribe(action => {
        expect(action.type).toMatchInlineSnapshot(`"[CostCenters API] Load Cost Center Success"`);
        expect(action.payload).toMatchInlineSnapshot(`
          Object {
            "costCenter": Object {
              "budget": Object {
                "currency": "USD",
                "value": 500,
              },
              "budgetPeriod": "monthly",
              "costCenterId": "100400",
              "id": "1",
              "name": "Headquarter",
            },
          }
        `);
        done();
      });
    });

    it('should dispatch a loadCostCenterFail action on failed cost center load', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(costCentersService.getCostCenter(anyString())).thenReturn(throwError(() => error));

      const action = loadCostCenter({ costCenterId });
      const completion = loadCostCenterFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.loadCostCenter$).toBeObservable(expected$);
    });
  });

  describe('addCostCenter$', () => {
    beforeEach(fakeAsync(() => {
      router.navigateByUrl('/cost-centers/create');
      tick(500);
    }));

    const costCenter = costCenters[0] as CostCenterBase;

    it('should call the service for creating a costCenter', done => {
      actions$ = of(addCostCenter({ costCenter }));

      effects.addCostCenter$.subscribe(() => {
        verify(costCentersService.addCostCenter(anything())).once();
        done();
      });
    });

    it('should create a costCenter when triggered', done => {
      actions$ = of(addCostCenter({ costCenter }));

      effects.addCostCenter$.pipe(toArray()).subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [CostCenters API] Add Cost Center Success:
            costCenter: {"id":"1","costCenterId":"100400","name":"Headquarter","budg...
          [Message] Success Toast:
            message: "account.organization.cost_center_management.create.confirma...
            messageParams: {"0":"Headquarter"}
          `);
        done();
      });
    });

    it('should navigate to the cost center detail on success', done => {
      actions$ = of(addCostCenter({ costCenter }));

      effects.addCostCenter$.subscribe({
        next: () => {
          expect(location.path()).toMatchInlineSnapshot(`"/cost-centers/1"`);
        },
        error: fail,
        complete: done,
      });
    });

    it('should dispatch an addCostCenterFail action on failed cost center creation', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(costCentersService.addCostCenter(anything())).thenReturn(throwError(() => error));

      const action = addCostCenter({ costCenter });
      const completion = addCostCenterFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.addCostCenter$).toBeObservable(expected$);
    });
  });

  describe('updateCostCenter$', () => {
    const costCenter = costCenters[0] as CostCenterBase;

    it('should call the service for updating a costCenter', done => {
      actions$ = of(updateCostCenter({ costCenter }));

      effects.updateCostCenter$.subscribe(() => {
        verify(costCentersService.updateCostCenter(anything())).once();
        done();
      });
    });

    it('should update a costCenter when triggered', done => {
      actions$ = of(updateCostCenter({ costCenter }));

      effects.updateCostCenter$.pipe(toArray()).subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [CostCenters API] Update Cost Center Success:
            costCenter: {"id":"1","costCenterId":"100400","name":"Headquarter","budg...
          [Message] Success Toast:
            message: "account.organization.cost_center_management.update.confirma...
            messageParams: {"0":"Headquarter"}
          `);
        done();
      });
    });

    it('should dispatch an updateCostCenterFail action on failed cost center update', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(costCentersService.updateCostCenter(anything())).thenReturn(throwError(() => error));

      const action = updateCostCenter({ costCenter });
      const completion = updateCostCenterFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.updateCostCenter$).toBeObservable(expected$);
    });
  });

  describe('deleteCostCenter$', () => {
    const id = costCenters[0].id;

    it('should call the service for deleting a costCenter', done => {
      actions$ = of(deleteCostCenter({ id }));

      effects.deleteCostCenter$.subscribe(() => {
        verify(costCentersService.deleteCostCenter(anything())).once();
        done();
      });
    });

    it('should delete a costCenter when triggered', done => {
      actions$ = of(deleteCostCenter({ id }));

      effects.deleteCostCenter$.pipe(toArray()).subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [CostCenters API] Delete Cost Center Success:
            id: "1"
          [Message] Success Toast:
            message: "account.organization.cost_center_management.delete.confirma...
          `);
        done();
      });
    });

    it('should dispatch a deleteCostCenterFail action on failed cost center deletion', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(costCentersService.deleteCostCenter(anything())).thenReturn(throwError(() => error));

      const action = deleteCostCenter({ id });
      const completion = deleteCostCenterFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.deleteCostCenter$).toBeObservable(expected$);
    });
  });

  describe('addCostCenterBuyer$s', () => {
    const costCenterId = costCenters[0].costCenterId;
    const buyers = [{ login: 'pmiller@test.intershop.de' }, { login: 'jlink@test.intershop.de' }] as CostCenterBuyer[];

    beforeEach(fakeAsync(() => {
      router.navigateByUrl('/cost-centers/1/buyers');
      tick(500);
    }));

    it('should call the service for adding buyers to a cost center', done => {
      actions$ = of(addCostCenterBuyers({ costCenterId, buyers }));

      effects.addCostCenterBuyers$.subscribe(() => {
        verify(costCentersService.addCostCenterBuyers(costCenterId, buyers)).once();
        done();
      });
    });

    it('should add costCenterBuyers when triggered', done => {
      actions$ = of(addCostCenterBuyers({ costCenterId, buyers }));

      effects.addCostCenterBuyers$.pipe(toArray()).subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [CostCenters API] Add Cost Center Buyers Success:
            costCenter: {"id":"1","costCenterId":"100400","name":"Headquarter","budg...
          [Message] Success Toast:
            message: "account.organization.cost_center_management.buyer.add.confi...
            messageParams: {"0":"2"}
        `);
        done();
      });
    });

    it('should navigate to the cost center detail page on success', done => {
      actions$ = of(addCostCenterBuyers({ costCenterId, buyers }));

      effects.addCostCenterBuyers$.subscribe({
        next: () => {
          expect(location.path()).toMatchInlineSnapshot(`"/cost-centers/1"`);
        },
        error: fail,
        complete: done,
      });
    });

    it('should dispatch an addCostCenterBuyersFail action in case of a failure', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(costCentersService.addCostCenterBuyers(anyString(), anything())).thenReturn(throwError(() => error));

      const action = addCostCenterBuyers({ costCenterId, buyers });
      const completion = addCostCenterBuyersFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.addCostCenterBuyers$).toBeObservable(expected$);
    });
  });

  describe('updateCostCenterBuyer$', () => {
    const costCenterId = costCenters[0].costCenterId;
    const buyer = { login: 'pmiller@test.intershop.de' } as CostCenterBuyer;

    it('should call the service for updating a costCenterBuyer', done => {
      actions$ = of(updateCostCenterBuyer({ costCenterId, buyer }));

      effects.updateCostCenterBuyer$.subscribe(() => {
        verify(costCentersService.updateCostCenterBuyer(costCenterId, buyer)).once();
        done();
      });
    });

    it('should update a costCenterBuyer when triggered', done => {
      actions$ = of(updateCostCenterBuyer({ costCenterId, buyer }));

      effects.updateCostCenterBuyer$.pipe(toArray()).subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [CostCenters API] Update Cost Center Buyer Success:
            costCenter: {"id":"1","costCenterId":"100400","name":"Headquarter","budg...
          [Message] Success Toast:
            message: "account.organization.cost_center_management.buyer.update.co...
            messageParams: {"0":"undefined undefined"}
        `);
        done();
      });
    });

    it('should dispatch an updateCostCenterBuyerFail action on failed cost center buyer update', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(costCentersService.updateCostCenterBuyer(anyString(), anything())).thenReturn(throwError(() => error));

      const action = updateCostCenterBuyer({ costCenterId, buyer });
      const completion = updateCostCenterBuyerFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.updateCostCenterBuyer$).toBeObservable(expected$);
    });
  });

  describe('deleteCostCenterBuyer$', () => {
    const costCenterId = costCenters[0].costCenterId;
    const login = 'pmiller@test.intershop.de';

    it('should call the service for deleting a costCenterBuyer', done => {
      actions$ = of(deleteCostCenterBuyer({ costCenterId, login }));

      effects.deleteCostCenterBuyer$.subscribe(() => {
        verify(costCentersService.deleteCostCenterBuyer(costCenterId, login)).once();
        done();
      });
    });

    it('should delete a costCenterBuyer when triggered', done => {
      actions$ = of(deleteCostCenterBuyer({ costCenterId, login }));

      effects.deleteCostCenterBuyer$.pipe(toArray()).subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [CostCenters API] Delete Cost Center Buyer Success:
            costCenter: {"id":"1","costCenterId":"100400","name":"Headquarter","budg...
          [Message] Success Toast:
            message: "account.organization.cost_center_management.buyer.remove.co...
            messageParams: {"0":"pmiller@test.intershop.de"}
        `);
        done();
      });
    });

    it('should dispatch a deleteCostCenterFail action on failed cost center buyer deletion', () => {
      const error = makeHttpError({ status: 401, code: 'feld' });
      when(costCentersService.deleteCostCenterBuyer(anyString(), anything())).thenReturn(throwError(() => error));

      const action = deleteCostCenterBuyer({ costCenterId, login });
      const completion = deleteCostCenterBuyerFail({ error });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-b', { b: completion });

      expect(effects.deleteCostCenterBuyer$).toBeObservable(expected$);
    });
  });
});
