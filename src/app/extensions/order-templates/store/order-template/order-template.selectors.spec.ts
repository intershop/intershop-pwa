import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { coreReducers } from 'ish-core/store/core-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { orderTemplatesReducers } from '../order-templates-store.module';

import {
  CreateOrderTemplate,
  CreateOrderTemplateFail,
  CreateOrderTemplateSuccess,
  DeleteOrderTemplate,
  DeleteOrderTemplateFail,
  DeleteOrderTemplateSuccess,
  LoadOrderTemplates,
  LoadOrderTemplatesFail,
  LoadOrderTemplatesSuccess,
  SelectOrderTemplate,
  UpdateOrderTemplate,
  UpdateOrderTemplateFail,
  UpdateOrderTemplateSuccess,
} from './order-template.actions';
import {
  getAllOrderTemplates,
  getOrderTemplateDetails,
  getOrderTemplateError,
  getOrderTemplateLoading,
  getSelectedOrderTemplateDetails,
  getSelectedOrderTemplateId,
} from './order-template.selectors';

describe('Order Template Selectors', () => {
  let store$: TestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({
        reducers: {
          ...coreReducers,
          orderTemplates: combineReducers(orderTemplatesReducers),
        },
      }),
    });

    store$ = TestBed.get(TestStore);
  });

  const orderTemplates = [
    {
      title: 'testing order template',
      id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      itemsCount: 0,
      public: false,
    },
    {
      title: 'testing order template 2',
      id: '.AsdHS18FIAAAFuNiUBWx0d',
      itemsCount: 0,
      public: false,
    },
  ];

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getOrderTemplateLoading(store$.state)).toBeFalse();
    });
    it('should not have a selected order template when in initial state', () => {
      expect(getSelectedOrderTemplateId(store$.state)).toBeUndefined();
    });
    it('should not have an error when in initial state', () => {
      expect(getOrderTemplateError(store$.state)).toBeUndefined();
    });
  });

  describe('loading order templates', () => {
    describe('LoadOrderTemplates', () => {
      const loadOrderTemplateAction = new LoadOrderTemplates();

      beforeEach(() => {
        store$.dispatch(loadOrderTemplateAction);
      });

      it('should set loading to true', () => {
        expect(getOrderTemplateLoading(store$.state)).toBeTrue();
      });
    });

    describe('LoadOrderTemplatesSuccess', () => {
      const loadOrderTemplateSuccessAction = new LoadOrderTemplatesSuccess({ orderTemplates });

      beforeEach(() => {
        store$ = TestBed.get(TestStore);
        store$.dispatch(loadOrderTemplateSuccessAction);
      });

      it('should set loading to false', () => {
        expect(getOrderTemplateLoading(store$.state)).toBeFalse();
      });

      it('should add order templates to state', () => {
        expect(getAllOrderTemplates(store$.state)).toEqual(orderTemplates);
      });
    });

    describe('LoadOrderTemplatesFail', () => {
      const loadOrderTemplatesFailAction = new LoadOrderTemplatesFail({ error: { message: 'invalid' } as HttpError });

      beforeEach(() => {
        store$ = TestBed.get(TestStore);
        store$.dispatch(loadOrderTemplatesFailAction);
      });

      it('should set loading to false', () => {
        expect(getOrderTemplateLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getOrderTemplateError(store$.state)).toEqual({ message: 'invalid' });
      });
    });
  });

  describe('create a order template', () => {
    describe('CreateOrderTemplate', () => {
      const createOrderTemplateAction = new CreateOrderTemplate({
        orderTemplate: {
          title: 'create title',
        },
      });

      beforeEach(() => {
        store$.dispatch(createOrderTemplateAction);
      });

      it('should set loading to true', () => {
        expect(getOrderTemplateLoading(store$.state)).toBeTrue();
      });
    });

    describe('CreateOrderTemplateSuccess', () => {
      const createOrderTemplateSuccessAction = new CreateOrderTemplateSuccess({ orderTemplate: orderTemplates[0] });

      beforeEach(() => {
        store$ = TestBed.get(TestStore);
        store$.dispatch(createOrderTemplateSuccessAction);
      });

      it('should set loading to false', () => {
        expect(getOrderTemplateLoading(store$.state)).toBeFalse();
      });

      it('should add new order template to state', () => {
        expect(getAllOrderTemplates(store$.state)).toContainEqual(orderTemplates[0]);
      });
    });

    describe('CreateOrderTemplatetFail', () => {
      const createOrderTemplateFailAction = new CreateOrderTemplateFail({ error: { message: 'invalid' } as HttpError });

      beforeEach(() => {
        store$ = TestBed.get(TestStore);
        store$.dispatch(createOrderTemplateFailAction);
      });

      it('should set loading to false', () => {
        expect(getOrderTemplateLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getOrderTemplateError(store$.state)).toEqual({ message: 'invalid' });
      });
    });
  });

  describe('delete a order template', () => {
    describe('DeleteOrderTemplate', () => {
      const deleteOrderTemplateAction = new DeleteOrderTemplate({ orderTemplateId: 'id' });

      beforeEach(() => {
        store$.dispatch(deleteOrderTemplateAction);
      });

      it('should set loading to true', () => {
        expect(getOrderTemplateLoading(store$.state)).toBeTrue();
      });
    });

    describe('DeleteOrderTemplateSuccess', () => {
      const loadOrderTemplateSuccessAction = new LoadOrderTemplatesSuccess({ orderTemplates });
      const deleteOrderTemplateSuccessAction = new DeleteOrderTemplateSuccess({
        orderTemplateId: orderTemplates[0].id,
      });

      beforeEach(() => {
        store$ = TestBed.get(TestStore);
      });

      it('should set loading to false', () => {
        store$.dispatch(deleteOrderTemplateSuccessAction);

        expect(getOrderTemplateLoading(store$.state)).toBeFalse();
      });

      it('should remove order template from state, when order template delete action was called', () => {
        store$.dispatch(loadOrderTemplateSuccessAction);
        store$.dispatch(deleteOrderTemplateSuccessAction);

        expect(getAllOrderTemplates(store$.state)).not.toContain(orderTemplates[0]);
      });
    });

    describe('DeleteOrderTemplateFail', () => {
      const deleteOrderTemplateFailAction = new DeleteOrderTemplateFail({ error: { message: 'invalid' } as HttpError });

      beforeEach(() => {
        store$ = TestBed.get(TestStore);
        store$.dispatch(deleteOrderTemplateFailAction);
      });

      it('should set loading to false', () => {
        expect(getOrderTemplateLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getOrderTemplateError(store$.state)).toEqual({ message: 'invalid' });
      });
    });
  });

  describe('updating a order template', () => {
    describe('UpdateOrderTemplate', () => {
      const updateOrderTemplateAction = new UpdateOrderTemplate({ orderTemplate: orderTemplates[0] });

      beforeEach(() => {
        store$.dispatch(updateOrderTemplateAction);
      });

      it('should set loading to true', () => {
        expect(getOrderTemplateLoading(store$.state)).toBeTrue();
      });
    });

    describe('UpdatOrderTemplateSuccess', () => {
      const updated = {
        ...orderTemplates[0],
        title: 'new title',
      };
      const updateOrderTemplateSuccessAction = new UpdateOrderTemplateSuccess({
        orderTemplate: updated,
      });
      const loadOrderTemplateSuccess = new LoadOrderTemplatesSuccess({ orderTemplates });

      beforeEach(() => {
        store$ = TestBed.get(TestStore);
      });

      it('should set loading to false', () => {
        store$.dispatch(updateOrderTemplateSuccessAction);

        expect(getOrderTemplateLoading(store$.state)).toBeFalse();
      });

      it('should update order template title to new title', () => {
        store$.dispatch(loadOrderTemplateSuccess);
        store$.dispatch(updateOrderTemplateSuccessAction);

        expect(getAllOrderTemplates(store$.state)).toContainEqual(updated);
      });
    });

    describe('UpdateOrderTemplateFail', () => {
      const updateOrderTemplateFailAction = new UpdateOrderTemplateFail({ error: { message: 'invalid' } as HttpError });

      beforeEach(() => {
        store$ = TestBed.get(TestStore);
        store$.dispatch(updateOrderTemplateFailAction);
      });

      it('should set loading to false', () => {
        expect(getOrderTemplateLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getOrderTemplateError(store$.state)).toEqual({ message: 'invalid' });
      });
    });
  });

  describe('Get Selected Order Template', () => {
    const loadOrderTemplatesSuccessActions = new LoadOrderTemplatesSuccess({ orderTemplates });
    const selectOrderTemplateAction = new SelectOrderTemplate({ id: orderTemplates[1].id });

    beforeEach(() => {
      store$.dispatch(loadOrderTemplatesSuccessActions);
      store$.dispatch(selectOrderTemplateAction);
    });

    it('should return correct order template id for given id', () => {
      expect(getSelectedOrderTemplateId(store$.state)).toEqual(orderTemplates[1].id);
    });

    it('should return correct order template details for given id', () => {
      expect(getSelectedOrderTemplateDetails(store$.state)).toEqual(orderTemplates[1]);
    });
  });

  describe('Get Order Template Details', () => {
    const loadOrderTemplateSuccessActions = new LoadOrderTemplatesSuccess({ orderTemplates });

    beforeEach(() => {
      store$.dispatch(loadOrderTemplateSuccessActions);
    });

    it('should return correct order template for given id', () => {
      expect(getOrderTemplateDetails(store$.state, { id: orderTemplates[1].id })).toEqual(orderTemplates[1]);
    });
  });
});
