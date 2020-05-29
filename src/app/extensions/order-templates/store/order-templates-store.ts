import { createFeatureSelector } from '@ngrx/store';

import { OrderTemplateState } from './order-template/order-template.reducer';

export interface OrderTemplatesState {
  orderTemplates: OrderTemplateState;
}

export const getOrderTemplatesState = createFeatureSelector<OrderTemplatesState>('orderTemplates');
