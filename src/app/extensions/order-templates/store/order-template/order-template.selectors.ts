import { createSelector } from '@ngrx/store';

import { getOrderTemplatesState } from '../order-templates-store';

import { initialState, orderTemplateAdapter } from './order-template.reducer';

const getOrderTemplateState = createSelector(getOrderTemplatesState, state =>
  state ? state.orderTemplates : initialState
);

const { selectEntities, selectAll } = orderTemplateAdapter.getSelectors(getOrderTemplateState);

export const getAllOrderTemplates = selectAll;

export const getOrderTemplateLoading = createSelector(getOrderTemplateState, state => state.loading);

export const getOrderTemplateError = createSelector(getOrderTemplateState, state => state.error);

export const getSelectedOrderTemplateId = createSelector(getOrderTemplateState, state => state.selected);

export const getSelectedOrderTemplateDetails = createSelector(
  selectEntities,
  getSelectedOrderTemplateId,
  (entities, id) => entities[id]
);

export const getOrderTemplateDetails = (id: string) => createSelector(selectEntities, entities => entities[id]);
