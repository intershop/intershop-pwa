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
  orderTemplatesActions,
  orderTemplatesApiActions,
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
    addBasketToNewOrderTemplate,
    addProductToOrderTemplate,
    createOrderTemplate,
    deleteOrderTemplate,
    loadOrderTemplates,
    orderTemplatesActions.createOrderTemplateFromLineItems,
    updateOrderTemplate
  ),
  unsetLoadingAndErrorOn(
    addBasketToNewOrderTemplateSuccess,
    addProductToOrderTemplateSuccess,
    createOrderTemplateSuccess,
    deleteOrderTemplateSuccess,
    loadOrderTemplatesSuccess,
    orderTemplatesApiActions.createOrderTemplateFromLineItemsSuccess,
    removeItemFromOrderTemplateSuccess,
    updateOrderTemplateSuccess
  ),
  setErrorOn(
    addBasketToNewOrderTemplateFail,
    addProductToOrderTemplateFail,
    createOrderTemplateFail,
    deleteOrderTemplateFail,
    loadOrderTemplatesFail,
    orderTemplatesApiActions.createOrderTemplateFromLineItemsFail,
    updateOrderTemplateFail
  ),

  on(
    addBasketToNewOrderTemplateFail,
    createOrderTemplateFail,
    deleteOrderTemplateFail,
    loadOrderTemplatesFail,
    orderTemplatesApiActions.createOrderTemplateFromLineItemsFail,
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
    addProductToOrderTemplateSuccess,
    createOrderTemplateSuccess,
    removeItemFromOrderTemplateSuccess,
    orderTemplatesApiActions.createOrderTemplateFromLineItemsSuccess,
    updateOrderTemplateSuccess,
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
