import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { OrderTemplate } from '../../models/order-template/order-template.model';

import {
  addBasketToNewOrderTemplate,
  addBasketToNewOrderTemplateFail,
  addBasketToNewOrderTemplateSuccess,
  addProductToOrderTemplate,
  addProductToOrderTemplateFail,
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
    updateOrderTemplate,
    addProductToOrderTemplate
  ),
  unsetLoadingAndErrorOn(
    loadOrderTemplatesSuccess,
    addBasketToNewOrderTemplateSuccess,
    createOrderTemplateSuccess,
    updateOrderTemplateSuccess,
    addProductToOrderTemplateSuccess,
    removeItemFromOrderTemplateSuccess,
    deleteOrderTemplateSuccess
  ),
  setErrorOn(
    loadOrderTemplatesFail,
    deleteOrderTemplateFail,
    createOrderTemplateFail,
    addBasketToNewOrderTemplateFail,
    updateOrderTemplateFail,
    addProductToOrderTemplateFail
  ),
  on(
    loadOrderTemplatesFail,
    deleteOrderTemplateFail,
    createOrderTemplateFail,
    addBasketToNewOrderTemplateFail,
    updateOrderTemplateFail,
    (state: OrderTemplateState): OrderTemplateState => ({
      ...state,
      selected: undefined as string,
    })
  ),
  on(loadOrderTemplatesSuccess, (state, action) => {
    const { orderTemplates } = action.payload;
    return orderTemplateAdapter.setAll(orderTemplates, state);
  }),
  on(
    addBasketToNewOrderTemplateSuccess,
    createOrderTemplateSuccess,
    updateOrderTemplateSuccess,
    addProductToOrderTemplateSuccess,
    removeItemFromOrderTemplateSuccess,
    (state, action) => {
      const { orderTemplate } = action.payload;

      return orderTemplateAdapter.upsertOne(orderTemplate, state);
    }
  ),
  on(deleteOrderTemplateSuccess, (state, action) => {
    const { orderTemplateId } = action.payload;
    return orderTemplateAdapter.removeOne(orderTemplateId, state);
  }),
  on(selectOrderTemplate, (state, action): OrderTemplateState => {
    const { id } = action.payload;
    return {
      ...state,
      selected: id,
    };
  })
);
