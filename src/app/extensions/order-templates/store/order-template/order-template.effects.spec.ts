import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { of, throwError } from 'rxjs';
import { anyNumber, anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { Customer } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { DisplaySuccessMessage } from 'ish-core/store/core/messages';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { LoginUserSuccess } from 'ish-core/store/customer/user';

import { OrderTemplate } from '../../models/order-template/order-template.model';
import { OrderTemplateService } from '../../services/order-template/order-template.service';
import { OrderTemplatesStoreModule } from '../order-templates-store.module';

import {
  AddProductToNewOrderTemplate,
  AddProductToOrderTemplate,
  AddProductToOrderTemplateFail,
  AddProductToOrderTemplateSuccess,
  CreateOrderTemplate,
  CreateOrderTemplateFail,
  CreateOrderTemplateSuccess,
  DeleteOrderTemplate,
  DeleteOrderTemplateFail,
  DeleteOrderTemplateSuccess,
  LoadOrderTemplates,
  LoadOrderTemplatesFail,
  LoadOrderTemplatesSuccess,
  MoveItemToOrderTemplate,
  OrderTemplatesActionTypes,
  RemoveItemFromOrderTemplate,
  RemoveItemFromOrderTemplateFail,
  RemoveItemFromOrderTemplateSuccess,
  SelectOrderTemplate,
  UpdateOrderTemplate,
  UpdateOrderTemplateFail,
  UpdateOrderTemplateSuccess,
} from './order-template.actions';
import { OrderTemplateEffects } from './order-template.effects';

describe('Order Template Effects', () => {
  let actions$;
  let orderTemplateServiceMock: OrderTemplateService;
  let effects: OrderTemplateEffects;
  let store$: Store;
  let router: Router;

  const customer = { customerNo: 'CID', isBusinessCustomer: true } as Customer;

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
  @Component({ template: 'dummy' })
  class DummyComponent {}

  beforeEach(() => {
    orderTemplateServiceMock = mock(OrderTemplateService);

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CoreStoreModule.forTesting(['router']),
        CustomerStoreModule.forTesting('user'),
        FeatureToggleModule.forTesting('orderTemplates'),
        OrderTemplatesStoreModule.forTesting('orderTemplates'),
        RouterTestingModule.withRoutes([
          { path: 'account/order-templates/:orderTemplateName', component: DummyComponent },
        ]),
      ],
      providers: [
        OrderTemplateEffects,
        provideMockActions(() => actions$),
        { provide: OrderTemplateService, useFactory: () => instance(orderTemplateServiceMock) },
      ],
    });

    effects = TestBed.inject(OrderTemplateEffects);
    store$ = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  describe('loadOrderTemplate$', () => {
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess({ customer }));
      when(orderTemplateServiceMock.getOrderTemplates()).thenReturn(of(orderTemplates));
    });

    it('should call the OrderTemplateService for loadOrderTemplate', done => {
      const action = new LoadOrderTemplates();
      actions$ = of(action);

      effects.loadOrderTemplates$.subscribe(() => {
        verify(orderTemplateServiceMock.getOrderTemplates()).once();
        done();
      });
    });

    it('should map to actions of type LoadOrderTemplatesSuccess', () => {
      const action = new LoadOrderTemplates();
      const completion = new LoadOrderTemplatesSuccess({
        orderTemplates,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrderTemplates$).toBeObservable(expected$);
    });

    it('should map failed calls to actions of type LoadOrderTemplateFail', () => {
      const error = { message: 'invalid' } as HttpError;
      when(orderTemplateServiceMock.getOrderTemplates()).thenReturn(throwError(error));
      const action = new LoadOrderTemplates();
      const completion = new LoadOrderTemplatesFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOrderTemplates$).toBeObservable(expected$);
    });
  });

  describe('createOrderTemplate$', () => {
    const orderTemplateData = [
      {
        title: 'testing order template',
        id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      } as OrderTemplate,
    ];
    const createOrderTemplateData = {
      title: 'testing order template',
      public: false,
    };
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess({ customer }));
      when(orderTemplateServiceMock.createOrderTemplate(anything())).thenReturn(of(orderTemplateData[0]));
    });

    it('should call the OrderTemplateService for createOrderTemplate', done => {
      const action = new CreateOrderTemplate({ orderTemplate: createOrderTemplateData });
      actions$ = of(action);

      effects.createOrderTemplate$.subscribe(() => {
        verify(orderTemplateServiceMock.createOrderTemplate(anything())).once();
        done();
      });
    });

    it('should map to actions of type CreateOrderTemplateSuccess and SuccessMessage', () => {
      const action = new CreateOrderTemplate({ orderTemplate: createOrderTemplateData });
      const completion1 = new CreateOrderTemplateSuccess({
        orderTemplate: orderTemplateData[0],
      });
      const completion2 = new DisplaySuccessMessage({
        message: 'account.order_template.new_order_template.confirmation',
        messageParams: { 0: createOrderTemplateData.title },
      });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.createOrderTemplate$).toBeObservable(expected$);
    });
    it('should map failed calls to actions of type CreateOrderTemplateFail', () => {
      const error = { message: 'invalid' } as HttpError;
      when(orderTemplateServiceMock.createOrderTemplate(anything())).thenReturn(throwError(error));
      const action = new CreateOrderTemplate({ orderTemplate: createOrderTemplateData });
      const completion = new CreateOrderTemplateFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createOrderTemplate$).toBeObservable(expected$);
    });
  });

  describe('deleteOrderTemplate$', () => {
    const id = orderTemplates[0].id;
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess({ customer }));
      store$.dispatch(new CreateOrderTemplateSuccess({ orderTemplate: orderTemplates[0] }));
      when(orderTemplateServiceMock.deleteOrderTemplate(anyString())).thenReturn(of(undefined));
    });

    it('should call the OrderTemplateService for deleteOrderTemplate', done => {
      const action = new DeleteOrderTemplate({ orderTemplateId: id });
      actions$ = of(action);

      effects.deleteOrderTemplate$.subscribe(() => {
        verify(orderTemplateServiceMock.deleteOrderTemplate(id)).once();
        done();
      });
    });

    it('should map to actions of type DeleteOrderTemplateSuccess', () => {
      const action = new DeleteOrderTemplate({ orderTemplateId: id });
      const completion1 = new DeleteOrderTemplateSuccess({ orderTemplateId: id });
      const completion2 = new DisplaySuccessMessage({
        message: 'account.order_template.delete_order_template.confirmation',
        messageParams: { 0: orderTemplates[0].title },
      });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.deleteOrderTemplate$).toBeObservable(expected$);
    });
    it('should map failed calls to actions of type DeleteOrderTemplateFail', () => {
      const error = { message: 'invalid' } as HttpError;
      when(orderTemplateServiceMock.deleteOrderTemplate(anyString())).thenReturn(throwError(error));
      const action = new DeleteOrderTemplate({ orderTemplateId: id });
      const completion = new DeleteOrderTemplateFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteOrderTemplate$).toBeObservable(expected$);
    });
  });

  describe('updateOrderTemplate$', () => {
    const orderTemplateDetailData = [
      {
        title: 'testing order template',
        id: '.SKsEQAE4FIAAAFuNiUBWx0d',
        itemCount: 0,
        public: false,
      },
    ];
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess({ customer }));
      when(orderTemplateServiceMock.updateOrderTemplate(anything())).thenReturn(of(orderTemplateDetailData[0]));
    });

    it('should call the OrderTemplateService for updateOrderTemplate', done => {
      const action = new UpdateOrderTemplate({ orderTemplate: orderTemplateDetailData[0] });
      actions$ = of(action);

      effects.updateOrderTemplate$.subscribe(() => {
        verify(orderTemplateServiceMock.updateOrderTemplate(anything())).once();
        done();
      });
    });

    it('should map to actions of type UpdateOrderTemplateSuccess', () => {
      const action = new UpdateOrderTemplate({ orderTemplate: orderTemplateDetailData[0] });
      const completion1 = new UpdateOrderTemplateSuccess({ orderTemplate: orderTemplateDetailData[0] });
      const completion2 = new DisplaySuccessMessage({
        message: 'account.order_templates.edit.confirmation',
        messageParams: { 0: orderTemplateDetailData[0].title },
      });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.updateOrderTemplate$).toBeObservable(expected$);
    });
    it('should map failed calls to actions of type UpdateOrderTemplateFail', () => {
      const error = { message: 'invalid' } as HttpError;
      when(orderTemplateServiceMock.updateOrderTemplate(anything())).thenReturn(throwError(error));
      const action = new UpdateOrderTemplate({ orderTemplate: orderTemplateDetailData[0] });
      const completion = new UpdateOrderTemplateFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateOrderTemplate$).toBeObservable(expected$);
    });
  });
  describe('addProductToOrderTemplate$', () => {
    const payload = {
      orderTemplateId: '.SKsEQAE4FIAAAFuNiUBWx0d',
      sku: 'sku',
      quantity: 2,
    };

    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess({ customer }));
      when(orderTemplateServiceMock.addProductToOrderTemplate(anyString(), anyString(), anyNumber())).thenReturn(
        of(orderTemplates[0])
      );
    });

    it('should call the OrderTemplateService for addProductToOrderTemplate', done => {
      const action = new AddProductToOrderTemplate(payload);
      actions$ = of(action);

      effects.addProductToOrderTemplate$.subscribe(() => {
        verify(
          orderTemplateServiceMock.addProductToOrderTemplate(payload.orderTemplateId, payload.sku, payload.quantity)
        ).once();
        done();
      });
    });

    it('should map to actions of type AddProductToOrderTemplateSuccess', () => {
      const action = new AddProductToOrderTemplate(payload);
      const completion = new AddProductToOrderTemplateSuccess({ orderTemplate: orderTemplates[0] });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.addProductToOrderTemplate$).toBeObservable(expected$);
    });

    it('should map failed calls to actions of type AddProductToOrderTemplateFail', () => {
      const error = { message: 'invalid' } as HttpError;
      when(orderTemplateServiceMock.addProductToOrderTemplate(anyString(), anyString(), anything())).thenReturn(
        throwError(error)
      );
      const action = new AddProductToOrderTemplate(payload);
      const completion = new AddProductToOrderTemplateFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addProductToOrderTemplate$).toBeObservable(expected$);
    });
  });

  describe('addProductToNewOrderTemplate$', () => {
    const payload = {
      title: 'new Order Template',
      sku: 'sku',
    };
    const orderTemplate = {
      title: 'testing order template',
      id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      itemCount: 0,
      public: false,
    };
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess({ customer }));
      when(orderTemplateServiceMock.createOrderTemplate(anything())).thenReturn(of(orderTemplate));
    });
    it('should map to actions of types CreateOrderTemplateSuccess and AddProductToOrderTemplate', () => {
      const action = new AddProductToNewOrderTemplate(payload);
      const completion1 = new CreateOrderTemplateSuccess({ orderTemplate });
      const completion2 = new AddProductToOrderTemplate({ orderTemplateId: orderTemplate.id, sku: payload.sku });
      const completion3 = new SelectOrderTemplate({ id: orderTemplate.id });
      actions$ = hot('-a-----a-----a', { a: action });
      const expected$ = cold('-(bcd)-(bcd)-(bcd)', { b: completion1, c: completion2, d: completion3 });
      expect(effects.addProductToNewOrderTemplate$).toBeObservable(expected$);
    });
    it('should map failed calls to actions of type CreateOrderTemplateFail', () => {
      const error = { message: 'invalid' } as HttpError;
      when(orderTemplateServiceMock.createOrderTemplate(anything())).thenReturn(throwError(error));
      const action = new AddProductToNewOrderTemplate(payload);
      const completion = new CreateOrderTemplateFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addProductToNewOrderTemplate$).toBeObservable(expected$);
    });
  });

  describe('moveProductToOrderTemplate$', () => {
    const payload1 = {
      source: { id: '1234' },
      target: { title: 'new Order Template', sku: 'sku', quantity: 1 },
    };
    const payload2 = {
      source: { id: '1234' },
      target: { id: '.SKsEQAE4FIAAAFuNiUBWx0d', sku: 'sku', quantity: 1 },
    };
    const orderTemplate = {
      title: 'testing order template',
      id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      itemCount: 0,
      public: false,
    };
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess({ customer }));
      when(orderTemplateServiceMock.createOrderTemplate(anything())).thenReturn(of(orderTemplate));
    });
    it('should map to actions of types AddProductToNewOrderTemplate and RemoveItemFromOrderTemplate if there is no target id given', () => {
      const action = new MoveItemToOrderTemplate(payload1);
      const completion1 = new AddProductToNewOrderTemplate({
        title: payload1.target.title,
        sku: payload1.target.sku,
        quantity: payload1.target.quantity,
      });
      const completion2 = new RemoveItemFromOrderTemplate({
        orderTemplateId: payload1.source.id,
        sku: payload1.target.sku,
      });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(bc)-(bc)-(bc)', { b: completion1, c: completion2 });
      expect(effects.moveItemToOrderTemplate$).toBeObservable(expected$);
    });
    it('should map to actions of types AddProductToOrderTemplate and RemoveItemFromOrderTemplate if there is a target id given', () => {
      const action = new MoveItemToOrderTemplate(payload2);
      const completion1 = new AddProductToOrderTemplate({
        orderTemplateId: orderTemplate.id,
        sku: payload1.target.sku,
        quantity: payload1.target.quantity,
      });
      const completion2 = new RemoveItemFromOrderTemplate({
        orderTemplateId: payload1.source.id,
        sku: payload1.target.sku,
      });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(bc)-(bc)-(bc)', { b: completion1, c: completion2 });
      expect(effects.moveItemToOrderTemplate$).toBeObservable(expected$);
    });
  });

  describe('removeProductFromOrderTemplate$', () => {
    const payload = {
      orderTemplateId: '.SKsEQAE4FIAAAFuNiUBWx0d',
      sku: 'sku',
    };
    const orderTemplate = {
      title: 'testing order template',
      id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      itemCount: 0,

      public: false,
    };
    beforeEach(() => {
      store$.dispatch(new LoginUserSuccess({ customer }));
      when(orderTemplateServiceMock.removeProductFromOrderTemplate(anyString(), anyString())).thenReturn(
        of(orderTemplate)
      );
    });

    it('should call the OrderTemplateService for removeProductFromOrderTemplate', done => {
      const action = new RemoveItemFromOrderTemplate(payload);
      actions$ = of(action);

      effects.removeProductFromOrderTemplate$.subscribe(() => {
        verify(orderTemplateServiceMock.removeProductFromOrderTemplate(payload.orderTemplateId, payload.sku)).once();
        done();
      });
    });
    it('should map to actions of type RemoveItemFromOrderTemplateSuccess', () => {
      const action = new RemoveItemFromOrderTemplate(payload);
      const completion = new RemoveItemFromOrderTemplateSuccess({ orderTemplate });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.removeProductFromOrderTemplate$).toBeObservable(expected$);
    });
    it('should map failed calls to actions of type RemoveItemFromOrderTemplateFail', () => {
      const error = { message: 'invalid' } as HttpError;
      when(orderTemplateServiceMock.removeProductFromOrderTemplate(anyString(), anyString())).thenReturn(
        throwError(error)
      );
      const action = new RemoveItemFromOrderTemplate(payload);
      const completion = new RemoveItemFromOrderTemplateFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.removeProductFromOrderTemplate$).toBeObservable(expected$);
    });
  });

  describe('routeListenerForSelectedOrderTemplate$', () => {
    it('should map to action of type SelectOrderTemplate', done => {
      router.navigateByUrl('/account/order-templates/.SKsEQAE4FIAAAFuNiUBWx0d');

      effects.routeListenerForSelectedOrderTemplate$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Order Templates Internal] Select Order Template:
            id: ".SKsEQAE4FIAAAFuNiUBWx0d"
        `);
        done();
      });
    });
  });

  describe('loadOrderTemplatesAfterLogin$', () => {
    beforeEach(() => {
      when(orderTemplateServiceMock.getOrderTemplates()).thenReturn(of(orderTemplates));
    });
    it('should call OrderTemplatesService after login action was dispatched', done => {
      effects.loadOrderTemplatesAfterLogin$.subscribe(action => {
        expect(action.type).toEqual(OrderTemplatesActionTypes.LoadOrderTemplates);
        done();
      });

      store$.dispatch(new LoginUserSuccess({ customer }));
    });
  });

  describe('setOrderTemplateBreadcrumb$', () => {
    beforeEach(() => {
      store$.dispatch(new LoadOrderTemplatesSuccess({ orderTemplates }));
      store$.dispatch(new SelectOrderTemplate({ id: orderTemplates[0].id }));
    });

    it('should set the breadcrumb of the selected Order Template', done => {
      effects.setOrderTemplateBreadcrumb$.subscribe(action => {
        expect(action.payload).toMatchInlineSnapshot(`
          Object {
            "breadcrumbData": Array [
              Object {
                "key": "account.ordertemplates.link",
                "link": "/account/order-templates",
              },
              Object {
                "text": "testing order template",
              },
            ],
          }
        `);
        done();
      });
    });
  });
});
