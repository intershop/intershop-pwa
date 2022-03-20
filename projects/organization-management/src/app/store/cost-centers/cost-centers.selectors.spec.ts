import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { CostCenter, CostCenterBase, CostCenterBuyer } from 'ish-core/models/cost-center/cost-center.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { OrganizationManagementStoreModule } from '../organization-management-store.module';

import {
  addCostCenter,
  addCostCenterBuyers,
  addCostCenterBuyersFail,
  addCostCenterBuyersSuccess,
  addCostCenterFail,
  addCostCenterSuccess,
  deleteCostCenter,
  deleteCostCenterBuyer,
  deleteCostCenterBuyerFail,
  deleteCostCenterBuyerSuccess,
  deleteCostCenterFail,
  deleteCostCenterSuccess,
  loadCostCenterSuccess,
  loadCostCenters,
  loadCostCentersFail,
  loadCostCentersSuccess,
  updateCostCenterBuyer,
  updateCostCenterBuyerFail,
  updateCostCenterBuyerSuccess,
} from './cost-centers.actions';
import {
  getCostCenters,
  getCostCentersError,
  getCostCentersLoading,
  getSelectedCostCenter,
} from './cost-centers.selectors';

describe('Cost Centers Selectors', () => {
  let store$: StoreWithSnapshots;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['router']),
        OrganizationManagementStoreModule.forTesting('costCenters'),
        RouterTestingModule.withRoutes([{ path: 'cost-centers/:CostCenterId', children: [] }]),
      ],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
    router = TestBed.inject(Router);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getCostCentersLoading(store$.state)).toBeFalse();
    });

    it('should not have an error when in initial state', () => {
      expect(getCostCentersError(store$.state)).toBeUndefined();
    });

    it('should not have entities when in initial state', () => {
      expect(getCostCenters(store$.state)).toBeEmpty();
    });
  });

  describe('LoadCostCenters', () => {
    const action = loadCostCenters();

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getCostCentersLoading(store$.state)).toBeTrue();
    });

    describe('LoadCostCentersSuccess', () => {
      const costCenters = [
        { id: '1', costCenterId: '100401' },
        { id: '2', costCenterId: '100402' },
        { id: '3', costCenterId: '100403' },
      ] as CostCenter[];
      const successAction = loadCostCentersSuccess({ costCenters });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should set loading to false', () => {
        expect(getCostCentersLoading(store$.state)).toBeFalse();
      });

      it('should not have an error when successfully loaded entities', () => {
        expect(getCostCentersError(store$.state)).toBeUndefined();
      });

      it('should have entities when successfully loading', () => {
        expect(getCostCenters(store$.state)).toHaveLength(3);
      });
    });

    describe('LoadCostCentersFail', () => {
      const error = makeHttpError({ message: 'ERROR' });
      const failAction = loadCostCentersFail({ error });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should set loading to false', () => {
        expect(getCostCentersLoading(store$.state)).toBeFalse();
      });

      it('should have an error when reducing', () => {
        expect(getCostCentersError(store$.state)).toBeTruthy();
      });

      it('should not have entities when reducing error', () => {
        expect(getCostCenters(store$.state)).toBeEmpty();
      });
    });
  });

  describe('SelectedCostCenter', () => {
    beforeEach(() => {
      const costCenters = [
        { id: '1', costCenterId: '100400' },
        { id: '2', costCenterId: '100401' },
      ] as CostCenter[];
      const successAction = loadCostCentersSuccess({ costCenters });
      store$.dispatch(successAction);
    });

    describe('with cost center detail route', () => {
      beforeEach(fakeAsync(() => {
        router.navigate(['cost-centers', '2']);
        tick(500);
      }));

      it('should return the cost center information when used', () => {
        expect(getCostCenters(store$.state)).not.toBeEmpty();
        expect(getCostCentersLoading(store$.state)).toBeFalse();
      });

      it('should return the selected cost center when the id is given as query param', () => {
        expect(getSelectedCostCenter(store$.state)).toBeTruthy();
      });
    });
  });

  describe('create a cost center', () => {
    const costCenter = {
      id: '1',
      costCenterId: '100400',
    } as CostCenterBase;

    describe('AddCostCenter', () => {
      const createCostCenterAction = addCostCenter({
        costCenter,
      });

      beforeEach(() => {
        store$.dispatch(createCostCenterAction);
      });

      it('should set loading to true', () => {
        expect(getCostCentersLoading(store$.state)).toBeTrue();
      });
    });

    describe('AddCostCenterSuccess', () => {
      const successAction = addCostCenterSuccess({ costCenter });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should set loading to false', () => {
        expect(getCostCentersLoading(store$.state)).toBeFalse();
      });

      it('should add new cost center to state', () => {
        expect(getCostCenters(store$.state)).toContainEqual(costCenter);
      });
    });

    describe('AddCostCenterFail', () => {
      const failAction = addCostCenterFail({ error: makeHttpError({ message: 'invalid' }) });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should set loading to false', () => {
        expect(getCostCentersLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getCostCentersError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "invalid",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });

  describe('delete a cost center', () => {
    const costCenter = {
      id: '1',
      costCenterId: '100400',
    } as CostCenterBase;
    const id = costCenter.id;

    describe('DeleteCostCenter', () => {
      const deleteCostCenterAction = deleteCostCenter({
        id,
      });

      beforeEach(() => {
        store$.dispatch(deleteCostCenterAction);
      });

      it('should set loading to true', () => {
        expect(getCostCentersLoading(store$.state)).toBeTrue();
      });
    });

    describe('DeleteCostCenterSuccess', () => {
      const loadAction = loadCostCenterSuccess({ costCenter });
      const successAction = deleteCostCenterSuccess({ id });

      beforeEach(() => {
        store$.dispatch(loadAction);
      });

      it('should set loading to false', () => {
        store$.dispatch(successAction);

        expect(getCostCentersLoading(store$.state)).toBeFalse();
      });

      it('should delete the cost center from state', () => {
        store$.dispatch(successAction);
        expect(getCostCenters(store$.state)).not.toContainEqual(costCenter);
      });
    });

    describe('DeleteCostCenterFail', () => {
      const failAction = deleteCostCenterFail({ error: makeHttpError({ message: 'invalid' }) });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should set loading to false', () => {
        expect(getCostCentersLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getCostCentersError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "invalid",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });

  describe('add cost center buyers', () => {
    const costCenter = {
      id: '1',
      costCenterId: '100400',
    } as CostCenterBase;
    const costCenterId = costCenter.id;
    const buyers = [{ login: 'pmiller@test.intershop.de' }, { login: 'jlink@test.intershop.de' }] as CostCenterBuyer[];

    describe('AddCostCenterBuyers', () => {
      const addCostCenterBuyersAction = addCostCenterBuyers({
        costCenterId,
        buyers,
      });

      beforeEach(() => {
        store$.dispatch(addCostCenterBuyersAction);
      });

      it('should set loading to true', () => {
        expect(getCostCentersLoading(store$.state)).toBeTrue();
      });
    });

    describe('AddCostCenterBuyersSuccess', () => {
      const loadAction = loadCostCenterSuccess({ costCenter });
      const successAction = addCostCenterBuyersSuccess({ costCenter });

      beforeEach(() => {
        store$.dispatch(loadAction);
      });

      it('should set loading to false', () => {
        store$.dispatch(successAction);

        expect(getCostCentersLoading(store$.state)).toBeFalse();
      });

      it('should update the cost center after aadding buyers', () => {
        store$.dispatch(successAction);
        expect(getCostCenters(store$.state)).toContainEqual(costCenter);
      });
    });

    describe('AddCostCenterBuyersFail', () => {
      const failAction = addCostCenterBuyersFail({ error: makeHttpError({ message: 'invalid' }) });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should set loading to false', () => {
        expect(getCostCentersLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getCostCentersError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "invalid",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });

  describe('update a cost center buyer', () => {
    const costCenter = {
      id: '1',
      costCenterId: '100400',
    } as CostCenterBase;
    const costCenterId = costCenter.id;
    const buyer = { login: 'pmiller@test.intershop.de' } as CostCenterBuyer;

    describe('UpdateCostCenterBuyer', () => {
      const updateCostCenterBuyerAction = updateCostCenterBuyer({
        costCenterId,
        buyer,
      });

      beforeEach(() => {
        store$.dispatch(updateCostCenterBuyerAction);
      });

      it('should set loading to true', () => {
        expect(getCostCentersLoading(store$.state)).toBeTrue();
      });
    });

    describe('UpdateCostCenterBuyerSuccess', () => {
      const loadAction = loadCostCenterSuccess({ costCenter });
      const successAction = updateCostCenterBuyerSuccess({ costCenter });

      beforeEach(() => {
        store$.dispatch(loadAction);
      });

      it('should set loading to false', () => {
        store$.dispatch(successAction);

        expect(getCostCentersLoading(store$.state)).toBeFalse();
      });

      it('should update the cost center after deletion', () => {
        store$.dispatch(successAction);
        expect(getCostCenters(store$.state)).toContainEqual(costCenter);
      });
    });

    describe('UpdateCostCenterBuyerFail', () => {
      const failAction = updateCostCenterBuyerFail({ error: makeHttpError({ message: 'invalid' }) });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should set loading to false', () => {
        expect(getCostCentersLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getCostCentersError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "invalid",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });

  describe('delete a cost center buyer', () => {
    const costCenter = {
      id: '1',
      costCenterId: '100400',
    } as CostCenterBase;
    const costCenterId = costCenter.id;
    const login = 'patricia@test.intershop.de';

    describe('DeleteCostCenterBuyer', () => {
      const deleteCostCenterBuyerAction = deleteCostCenterBuyer({
        costCenterId,
        login,
      });

      beforeEach(() => {
        store$.dispatch(deleteCostCenterBuyerAction);
      });

      it('should set loading to true', () => {
        expect(getCostCentersLoading(store$.state)).toBeTrue();
      });
    });

    describe('DeleteCostCenterBuyerSuccess', () => {
      const loadAction = loadCostCenterSuccess({ costCenter });
      const successAction = deleteCostCenterBuyerSuccess({ costCenter });

      beforeEach(() => {
        store$.dispatch(loadAction);
      });

      it('should set loading to false', () => {
        store$.dispatch(successAction);

        expect(getCostCentersLoading(store$.state)).toBeFalse();
      });

      it('should update the cost center after deletion', () => {
        store$.dispatch(successAction);
        expect(getCostCenters(store$.state)).toContainEqual(costCenter);
      });
    });

    describe('DeleteCostCenterBuyerFail', () => {
      const failAction = deleteCostCenterBuyerFail({ error: makeHttpError({ message: 'invalid' }) });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should set loading to false', () => {
        expect(getCostCentersLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getCostCentersError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "invalid",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });
});
