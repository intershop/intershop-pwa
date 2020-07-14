import { createSelector } from '@ngrx/store';

import { selectRouteParam } from 'ish-core/store/core/router';

import { TactonProductConfigurationHelper } from '../../models/tacton-product-configuration/tacton-product-configuration.helper';
import {
  TactonProductConfigurationGroup,
  TactonProductConfigurationParameter,
} from '../../models/tacton-product-configuration/tacton-product-configuration.model';
import { getTactonState } from '../tacton-store';

const getProductConfigurationState = createSelector(getTactonState, state => state?.productConfiguration);

export const getProductConfigurationLoading = createSelector(getProductConfigurationState, state => state?.loading);

export const getCurrentProductConfiguration = createSelector(getProductConfigurationState, state => state?.current);

function mapMembers(members: (TactonProductConfigurationGroup | TactonProductConfigurationParameter)[] = []) {
  return members
    .filter(TactonProductConfigurationHelper.isGroup)
    .filter(g => g.description)
    .map(group => ({
      description: group.description,
      name: group.name,
      children: mapMembers(group.members),
    }));
}

export const getConfigurationStepTree = createSelector(getCurrentProductConfiguration, config =>
  config?.steps.map(step => ({
    description: step.description,
    name: step.name,
    children: mapMembers(step.rootGroup?.members),
  }))
);

export const getCurrentStepConfig = createSelector(
  selectRouteParam('mainStep'),
  selectRouteParam('firstStep'),
  getCurrentProductConfiguration,
  (main, first, config) => config?.steps.find(m => m.name === main)?.rootGroup?.members.find(m => m.name === first)
);
