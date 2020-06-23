import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { OrderTemplate, OrderTemplateHeader } from '../../models/order-template/order-template.model';

export const loadOrderTemplates = createAction('[Order Templates Internal] Load Order Templates');

export const loadOrderTemplatesSuccess = createAction(
  '[Order Templates API] Load Order Templates Success',
  payload<{ orderTemplates: OrderTemplate[] }>()
);

export const loadOrderTemplatesFail = createAction('[Order Templates API] Load Order Templates Fail', httpError());

export const createOrderTemplate = createAction(
  '[Order Templates] Create Order Template',
  payload<{ orderTemplate: OrderTemplateHeader }>()
);

export const createOrderTemplateSuccess = createAction(
  '[Order Templates API] Create Order Template Success',
  payload<{ orderTemplate: OrderTemplate }>()
);

export const createOrderTemplateFail = createAction('[Order Templates API] Create Order Template Fail', httpError());

export const updateOrderTemplate = createAction(
  '[Order Templates] Update Order Template',
  payload<{ orderTemplate: OrderTemplate }>()
);

export const updateOrderTemplateSuccess = createAction(
  '[Order Templates API] Update Order Template Success',
  payload<{ orderTemplate: OrderTemplate }>()
);

export const updateOrderTemplateFail = createAction('[Order Templates API] Update Order Template Fail', httpError());

export const deleteOrderTemplate = createAction(
  '[Order Templates] Delete Order Template',
  payload<{ orderTemplateId: string }>()
);

export const deleteOrderTemplateSuccess = createAction(
  '[Order Templates API] Delete Order Template Success',
  payload<{ orderTemplateId: string }>()
);

export const deleteOrderTemplateFail = createAction('[Order Templates API] Delete Order Template Fail', httpError());

export const addProductToOrderTemplate = createAction(
  '[Order Templates] Add Item to Order Template',
  payload<{ orderTemplateId: string; sku: string; quantity?: number }>()
);

export const addProductToOrderTemplateSuccess = createAction(
  '[Order Templates API] Add Item to Order Template Success',
  payload<{ orderTemplate: OrderTemplate }>()
);

export const addProductToOrderTemplateFail = createAction(
  '[Order Templates API] Add Item to Order Template Fail',
  httpError()
);

export const addProductToNewOrderTemplate = createAction(
  '[Order Templates Internal] Add Product To New Order Template',
  payload<{ title: string; sku: string; quantity?: number }>()
);

export const moveItemToOrderTemplate = createAction(
  '[Order Templates] Move Item to another Order Template',
  payload<{ source: { id: string }; target: { id?: string; title?: string; sku: string; quantity: number } }>()
);

export const removeItemFromOrderTemplate = createAction(
  '[Order Templates] Remove Item from Order Template',
  payload<{ orderTemplateId: string; sku: string }>()
);

export const removeItemFromOrderTemplateSuccess = createAction(
  '[Order Templates API] Remove Item from Order Template Success',
  payload<{ orderTemplate: OrderTemplate }>()
);

export const removeItemFromOrderTemplateFail = createAction(
  '[Order Templates API] Remove Item from Order Template Fail',
  httpError()
);

export const selectOrderTemplate = createAction(
  '[Order Templates Internal] Select Order Template',
  payload<{ id: string }>()
);

export const addBasketToNewOrderTemplate = createAction(
  '[Order Templates] Add basket to New Order Template]',
  payload<{ orderTemplate: OrderTemplateHeader }>()
);

export const addBasketToNewOrderTemplateFail = createAction(
  '[Order Templates API] Add basket to New Order Template Fail]',
  httpError()
);

export const addBasketToNewOrderTemplateSuccess = createAction(
  '[Order Templates API] Add basket to New Order Template Success]',
  payload<{ orderTemplate: OrderTemplate }>()
);
