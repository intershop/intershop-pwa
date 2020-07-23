import { createSelector } from '@ngrx/store';

import { selectRouteParam, selectUrl } from 'ish-core/store/core/router';

import { TactonNavigationTree } from '../../models/tacton-navigation-tree/tacton-navigation-tree.model';
import { TactonProductConfigurationHelper } from '../../models/tacton-product-configuration/tacton-product-configuration.helper';
import {
  TactonProductConfigurationGroup,
  TactonProductConfigurationParameter,
} from '../../models/tacton-product-configuration/tacton-product-configuration.model';
import { TactonStepConfig } from '../../models/tacton-step-config/tacton-step-config.model';
import { getTactonState } from '../tacton-store';

const getProductConfigurationState = createSelector(getTactonState, state => state?.productConfiguration);

export const getProductConfigurationLoading = createSelector(getProductConfigurationState, state => state?.loading);

export const getCurrentProductConfiguration = createSelector(
  getProductConfigurationState,
  selectUrl,
  (state, url) => url?.startsWith('/configure') && state?.current
);

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
    config?.steps?.map(step => ({
      description: step.description,
      name: step.name,
      active: step.current,
      children: mapMembers(step.rootGroup?.members),
    }))
);

export const getCurrentStepConfig = createSelector(
  selectRouteParam('mainStep'),
  getCurrentProductConfiguration,
  (mainStep, config) => config?.steps?.find(m => m.name === mainStep)?.rootGroup
);

export const getCurrentProductConfigurationStepName = createSelector(
  getCurrentProductConfiguration,
  config => config?.steps?.find(step => step.current)?.name
);

export const getConfigurationStepConfig = createSelector(
  getCurrentProductConfiguration,
  (config): TactonStepConfig =>
    config?.steps && {
      length: config?.steps?.length,
      previousStep: config?.steps?.find((_, idx, arr) => idx < arr.length && arr[idx + 1]?.current)?.name,
      currentStep: config?.steps?.find(s => s.current)?.name,
      nextStep: config?.steps?.find((_, idx, arr) => idx > 0 && arr[idx - 1]?.current)?.name,
    }
);
