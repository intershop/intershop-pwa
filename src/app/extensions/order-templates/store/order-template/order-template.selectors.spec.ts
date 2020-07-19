import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { OrderTemplatesStoreModule } from '../order-templates-store.module';

import {
  createOrderTemplate,
  createOrderTemplateFail,
  createOrderTemplateSuccess,
  deleteOrderTemplate,
  deleteOrderTemplateFail,
  deleteOrderTemplateSuccess,
  loadOrderTemplates,
  loadOrderTemplatesFail,
  loadOrderTemplatesSuccess,
  selectOrderTemplate,
  updateOrderTemplate,
  updateOrderTemplateFail,
  updateOrderTemplateSuccess,
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
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), OrderTemplatesStoreModule.forTesting('orderTemplates')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
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
      const loadOrderTemplateAction = loadOrderTemplates();

      beforeEach(() => {
        store$.dispatch(loadOrderTemplateAction);
      });

      it('should set loading to true', () => {
        expect(getOrderTemplateLoading(store$.state)).toBeTrue();
      });
    });

    describe('LoadOrderTemplatesSuccess', () => {
      const loadOrderTemplateSuccessAction = loadOrderTemplatesSuccess({ orderTemplates });

      beforeEach(() => {
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
      const loadOrderTemplatesFailAction = loadOrderTemplatesFail({ error: makeHttpError({ message: 'invalid' }) });

      beforeEach(() => {
        store$.dispatch(loadOrderTemplatesFailAction);
      });

      it('should set loading to false', () => {
        expect(getOrderTemplateLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getOrderTemplateError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "invalid",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });

  describe('create a order template', () => {
    describe('CreateOrderTemplate', () => {
      const createOrderTemplateAction = createOrderTemplate({
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
      const createOrderTemplateSuccessAction = createOrderTemplateSuccess({ orderTemplate: orderTemplates[0] });

      beforeEach(() => {
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
      const createOrderTemplateFailAction = createOrderTemplateFail({ error: makeHttpError({ message: 'invalid' }) });

      beforeEach(() => {
        store$.dispatch(createOrderTemplateFailAction);
      });

      it('should set loading to false', () => {
        expect(getOrderTemplateLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getOrderTemplateError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "invalid",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });

  describe('delete a order template', () => {
    describe('DeleteOrderTemplate', () => {
      const deleteOrderTemplateAction = deleteOrderTemplate({ orderTemplateId: 'id' });

      beforeEach(() => {
        store$.dispatch(deleteOrderTemplateAction);
      });

      it('should set loading to true', () => {
        expect(getOrderTemplateLoading(store$.state)).toBeTrue();
      });
    });

    describe('DeleteOrderTemplateSuccess', () => {
      const loadOrderTemplateSuccessAction = loadOrderTemplatesSuccess({ orderTemplates });
      const deleteOrderTemplateSuccessAction = deleteOrderTemplateSuccess({
        orderTemplateId: orderTemplates[0].id,
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
      const deleteOrderTemplateFailAction = deleteOrderTemplateFail({ error: makeHttpError({ message: 'invalid' }) });

      beforeEach(() => {
        store$.dispatch(deleteOrderTemplateFailAction);
      });

      it('should set loading to false', () => {
        expect(getOrderTemplateLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getOrderTemplateError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "invalid",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });

  describe('updating a order template', () => {
    describe('UpdateOrderTemplate', () => {
      const updateOrderTemplateAction = updateOrderTemplate({ orderTemplate: orderTemplates[0] });

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
      const updateOrderTemplateSuccessAction = updateOrderTemplateSuccess({
        orderTemplate: updated,
      });
      const loadOrderTemplateSuccess = loadOrderTemplatesSuccess({ orderTemplates });

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
      const updateOrderTemplateFailAction = updateOrderTemplateFail({ error: makeHttpError({ message: 'invalid' }) });

      beforeEach(() => {
        store$.dispatch(updateOrderTemplateFailAction);
      });

      it('should set loading to false', () => {
        expect(getOrderTemplateLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getOrderTemplateError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "invalid",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });

  describe('Get Selected Order Template', () => {
    const loadOrderTemplatesSuccessActions = loadOrderTemplatesSuccess({ orderTemplates });
    const selectOrderTemplateAction = selectOrderTemplate({ id: orderTemplates[1].id });

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
    const loadOrderTemplateSuccessActions = loadOrderTemplatesSuccess({ orderTemplates });

    beforeEach(() => {
      store$.dispatch(loadOrderTemplateSuccessActions);
    });

    it('should return correct order template for given id', () => {
      expect(getOrderTemplateDetails(store$.state, { id: orderTemplates[1].id })).toEqual(orderTemplates[1]);
    });
  });
});
