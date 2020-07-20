import { createSelector } from '@ngrx/store';

import { selectRouteParam } from 'ish-core/store/core/router';

import { TactonNavigationTree } from '../../models/tacton-navigation-tree/tacton-navigation-tree.model';
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

export const getConfigurationStepTree = createSelector(
  getCurrentProductConfiguration,
  (config): TactonNavigationTree =>
    config?.steps.map(step => ({
      description: step.description,
      name: step.name,
      children: mapMembers(step.rootGroup?.members),
    }))
);

export const getCurrentStepConfig = createSelector(
  selectRouteParam('mainStep'),
  selectRouteParam('groupStep'),
  getCurrentProductConfiguration,
  (mainStep, groupStep, config) => {
    const rootGroup = config?.steps.find(m => m.name === mainStep)?.rootGroup;
    return groupStep ? rootGroup?.members.find(m => m.name === groupStep) : rootGroup;
  }
);

export const getCurrentProductConfigurationStepName = createSelector(
  getCurrentProductConfiguration,
  config => config?.steps.find(step => step.current)?.name
);
