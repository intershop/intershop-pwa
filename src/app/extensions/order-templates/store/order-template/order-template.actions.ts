import { Action } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { OrderTemplate, OrderTemplateHeader } from '../../models/order-template/order-template.model';

export enum OrderTemplatesActionTypes {
  LoadOrderTemplates = '[Order Templates Internal] Load Order Templates',
  LoadOrderTemplatesSuccess = '[Order Templates API] Load Order Templates Success',
  LoadOrderTemplatesFail = '[Order Templates API] Load Order Templates Fail',

  CreateOrderTemplate = '[Order Templates] Create Order Template',
  CreateOrderTemplateSuccess = '[Order Templates API] Create Order Template Success',
  CreateOrderTemplateFail = '[Order Templates API] Create Order Template Fail',
  CreateOrderTemplateWithItems = '[Order Templates] Create Order Template with basket items',

  UpdateOrderTemplate = '[Order Templates] Update Order Template',
  UpdateOrderTemplateSuccess = '[Order Templates API] Update Order Template Success',
  UpdateOrderTemplateFail = '[Order Templates API] Update Order Template Fail',

  DeleteOrderTemplate = '[Order Templates] Delete Order Template',
  DeleteOrderTemplateSuccess = '[Order Templates API] Delete Order Template Success',
  DeleteOrderTemplateFail = '[Order Templates API] Delete Order Template Fail',

  AddProductToOrderTemplate = '[Order Templates] Add Item to Order Template',
  AddProductToOrderTemplateSuccess = '[Order Templates API] Add Item to Order Template Success',
  AddProductToOrderTemplateFail = '[Order Templates API] Add Item to Order Template Fail',

  AddProductToNewOrderTemplate = '[Order Templates Internal] Add Product To New Order Template',

  MoveItemToOrderTemplate = '[Order Templates] Move Item to another Order Template',

  RemoveItemFromOrderTemplate = '[Order Templates] Remove Item from Order Template',
  RemoveItemFromOrderTemplateSuccess = '[Order Templates API] Remove Item from Order Template Success',
  RemoveItemFromOrderTemplateFail = '[Order Templates API] Remove Item from Order Template Fail',

  SelectOrderTemplate = '[Order Templates Internal] Select Order Template',
  ResetOrderTemplateState = '[Order Templates Internal] Reset Order Template State',

  AddBasketToNewOrderTemplate = '[Order Templates] Add basket to New Order Template]',
  AddBasketToNewOrderTemplateSuccess = '[Order Templates] Add basket to New Order Template Success]',
  AddBasketToNewOrderTemplateFail = '[Order Templates] Add basket to New Order Template Fail]',
}

export class LoadOrderTemplates implements Action {
  readonly type = OrderTemplatesActionTypes.LoadOrderTemplates;
}

export class LoadOrderTemplatesSuccess implements Action {
  readonly type = OrderTemplatesActionTypes.LoadOrderTemplatesSuccess;
  constructor(public payload: { orderTemplates: OrderTemplate[] }) {}
}

export class LoadOrderTemplatesFail implements Action {
  readonly type = OrderTemplatesActionTypes.LoadOrderTemplatesFail;
  constructor(public payload: { error: HttpError }) {}
}

export class CreateOrderTemplate implements Action {
  readonly type = OrderTemplatesActionTypes.CreateOrderTemplate;
  constructor(public payload: { orderTemplate: OrderTemplateHeader }) {}
}

export class CreateOrderTemplateSuccess implements Action {
  readonly type = OrderTemplatesActionTypes.CreateOrderTemplateSuccess;
  constructor(public payload: { orderTemplate: OrderTemplate }) {}
}

export class CreateOrderTemplateFail implements Action {
  readonly type = OrderTemplatesActionTypes.CreateOrderTemplateFail;
  constructor(public payload: { error: HttpError }) {}
}

export class UpdateOrderTemplate implements Action {
  readonly type = OrderTemplatesActionTypes.UpdateOrderTemplate;
  constructor(public payload: { orderTemplate: OrderTemplate }) {}
}

export class UpdateOrderTemplateSuccess implements Action {
  readonly type = OrderTemplatesActionTypes.UpdateOrderTemplateSuccess;
  constructor(public payload: { orderTemplate: OrderTemplate }) {}
}

export class UpdateOrderTemplateFail implements Action {
  readonly type = OrderTemplatesActionTypes.UpdateOrderTemplateFail;
  constructor(public payload: { error: HttpError }) {}
}

export class DeleteOrderTemplate implements Action {
  readonly type = OrderTemplatesActionTypes.DeleteOrderTemplate;
  constructor(public payload: { orderTemplateId: string }) {}
}

export class DeleteOrderTemplateSuccess implements Action {
  readonly type = OrderTemplatesActionTypes.DeleteOrderTemplateSuccess;

  constructor(public payload: { orderTemplateId: string }) {}
}

export class DeleteOrderTemplateFail implements Action {
  readonly type = OrderTemplatesActionTypes.DeleteOrderTemplateFail;
  constructor(public payload: { error: HttpError }) {}
}

export class AddProductToOrderTemplate implements Action {
  readonly type = OrderTemplatesActionTypes.AddProductToOrderTemplate;
  constructor(public payload: { orderTemplateId: string; sku: string; quantity?: number }) {}
}

export class AddProductToOrderTemplateSuccess implements Action {
  readonly type = OrderTemplatesActionTypes.AddProductToOrderTemplateSuccess;
  constructor(public payload: { orderTemplate: OrderTemplate }) {}
}

export class AddProductToOrderTemplateFail implements Action {
  readonly type = OrderTemplatesActionTypes.AddProductToOrderTemplateFail;
  constructor(public payload: { error: HttpError }) {}
}

export class AddProductToNewOrderTemplate implements Action {
  readonly type = OrderTemplatesActionTypes.AddProductToNewOrderTemplate;
  constructor(public payload: { title: string; sku: string; quantity?: number }) {}
}

export class MoveItemToOrderTemplate implements Action {
  readonly type = OrderTemplatesActionTypes.MoveItemToOrderTemplate;
  constructor(
    public payload: { source: { id: string }; target: { id?: string; title?: string; sku: string; quantity: number } }
  ) {}
}

export class RemoveItemFromOrderTemplate implements Action {
  readonly type = OrderTemplatesActionTypes.RemoveItemFromOrderTemplate;
  constructor(public payload: { orderTemplateId: string; sku: string }) {}
}

export class RemoveItemFromOrderTemplateSuccess implements Action {
  readonly type = OrderTemplatesActionTypes.RemoveItemFromOrderTemplateSuccess;
  constructor(public payload: { orderTemplate: OrderTemplate }) {}
}

export class RemoveItemFromOrderTemplateFail implements Action {
  readonly type = OrderTemplatesActionTypes.RemoveItemFromOrderTemplateFail;
  constructor(public payload: { error: HttpError }) {}
}

export class SelectOrderTemplate implements Action {
  readonly type = OrderTemplatesActionTypes.SelectOrderTemplate;
  constructor(public payload: { id: string }) {}
}

export class ResetOrderTemplateState implements Action {
  readonly type = OrderTemplatesActionTypes.ResetOrderTemplateState;
}

export class AddBasketToNewOrderTemplate implements Action {
  readonly type = OrderTemplatesActionTypes.AddBasketToNewOrderTemplate;
  constructor(public payload: { orderTemplate: OrderTemplateHeader }) {}
}

export class AddBasketToNewOrderTemplateFail implements Action {
  readonly type = OrderTemplatesActionTypes.AddBasketToNewOrderTemplateFail;
  constructor(public payload: { error: HttpError }) {}
}

export class AddBasketToNewOrderTemplateSuccess implements Action {
  readonly type = OrderTemplatesActionTypes.AddBasketToNewOrderTemplateSuccess;
  constructor(public payload: { orderTemplate: OrderTemplate }) {}
}

export type OrderTemplateAction =
  | LoadOrderTemplates
  | LoadOrderTemplatesSuccess
  | LoadOrderTemplatesFail
  | CreateOrderTemplate
  | CreateOrderTemplateSuccess
  | CreateOrderTemplateFail
  | UpdateOrderTemplate
  | UpdateOrderTemplateSuccess
  | UpdateOrderTemplateFail
  | DeleteOrderTemplate
  | DeleteOrderTemplateSuccess
  | DeleteOrderTemplateFail
  | AddProductToOrderTemplate
  | AddProductToOrderTemplateSuccess
  | AddProductToOrderTemplateFail
  | AddProductToNewOrderTemplate
  | MoveItemToOrderTemplate
  | RemoveItemFromOrderTemplate
  | RemoveItemFromOrderTemplateSuccess
  | RemoveItemFromOrderTemplateFail
  | SelectOrderTemplate
  | ResetOrderTemplateState
  | AddBasketToNewOrderTemplate
  | AddBasketToNewOrderTemplateSuccess
  | AddBasketToNewOrderTemplateFail;
