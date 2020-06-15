import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setLoadingOn } from 'ish-core/utils/ngrx-creators';

import { OrderTemplate } from '../../models/order-template/order-template.model';

import {
  addBasketToNewOrderTemplate,
  addBasketToNewOrderTemplateFail,
  addBasketToNewOrderTemplateSuccess,
  addProductToOrderTemplateSuccess,
  createOrderTemplate,
  createOrderTemplateFail,
  createOrderTemplateSuccess,
  deleteOrderTemplate,
  deleteOrderTemplateFail,
  deleteOrderTemplateSuccess,
  loadOrderTemplates,
  loadOrderTemplatesFail,
  loadOrderTemplatesSuccess,
  removeItemFromOrderTemplateSuccess,
  selectOrderTemplate,
  updateOrderTemplate,
  updateOrderTemplateFail,
  updateOrderTemplateSuccess,
} from './order-template.actions';

export interface OrderTemplateState extends EntityState<OrderTemplate> {
  loading: boolean;
  selected: string;
  error: HttpError;
}

export const orderTemplateAdapter = createEntityAdapter<OrderTemplate>({
  selectId: orderTemplate => orderTemplate.id,
});

export const initialState: OrderTemplateState = orderTemplateAdapter.getInitialState({
  loading: false,
  selected: undefined,
  error: undefined,
});

export const orderTemplateReducer = createReducer(
  initialState,
  setLoadingOn(
    loadOrderTemplates,
    createOrderTemplate,
    addBasketToNewOrderTemplate,
    deleteOrderTemplate,
    updateOrderTemplate
  ),
  on(
    loadOrderTemplatesFail,
    deleteOrderTemplateFail,
    createOrderTemplateFail,
    addBasketToNewOrderTemplateFail,
    updateOrderTemplateFail,
    (state: OrderTemplateState, action) => {
      const { error } = action.payload;
      return {
        ...state,
        loading: false,
        error,
        selected: undefined,
      };
    }
  ),
  on(loadOrderTemplatesSuccess, (state: OrderTemplateState, action) => {
    const { orderTemplates } = action.payload;
    return orderTemplateAdapter.setAll(orderTemplates, {
      ...state,
      loading: false,
    });
  }),
  on(
    addBasketToNewOrderTemplateSuccess,
    createOrderTemplateSuccess,
    updateOrderTemplateSuccess,
    addProductToOrderTemplateSuccess,
    removeItemFromOrderTemplateSuccess,
    (state: OrderTemplateState, action) => {
      const { orderTemplate } = action.payload;

      return orderTemplateAdapter.upsertOne(orderTemplate, {
        ...state,
        loading: false,
      });
    }
  ),
  on(deleteOrderTemplateSuccess, (state: OrderTemplateState, action) => {
    const { orderTemplateId } = action.payload;
    return orderTemplateAdapter.removeOne(orderTemplateId, {
      ...state,
      loading: false,
    });
  }),
  on(selectOrderTemplate, (state: OrderTemplateState, action) => {
    const { id } = action.payload;
    return {
      ...state,
      selected: id,
    };
  })
);
