import { Params } from '@angular/router';
import { RouterNavigationPayload, routerNavigationAction } from '@ngrx/router-store';
import { ActionReducer } from '@ngrx/store';

import { FeatureToggleType } from 'ish-core/feature-toggle.module';
import { SparqueConfig, getEmptySparqueConfig } from 'ish-core/models/sparque/sparque-config.model';
import { applyConfiguration } from 'ish-core/store/core/configuration';
import { ConfigurationState, configurationReducer } from 'ish-core/store/core/configuration/configuration.reducer';
import { CoreState } from 'ish-core/store/core/core-store';
import { RouterState } from 'ish-core/store/core/router/router.reducer';
import { mergeDeep } from 'ish-core/utils/functions';

class SimpleParamMap {
  constructor(private obj: Params) {}
  has(key: string): boolean {
    return this.obj[key] !== undefined;
  }
  get<T>(key: string): T {
    return this.obj[key];
  }
}

// eslint-disable-next-line complexity
function extractConfigurationParameters(state: ConfigurationState, paramMap: SimpleParamMap) {
  console.log('extractConfigurationParameters');
  console.log('paramMap', paramMap);
  const keys: (keyof ConfigurationState)[] = ['channel', 'application', 'lang', 'currency', 'identityProvider'];
  const properties: Partial<ConfigurationState> = keys
    .filter(key => paramMap.has(key) && paramMap.get(key) !== 'default')
    .map(key => ({ [key]: paramMap.get(key) }))
    .reduce((acc, val) => ({ ...acc, ...val }), {});

  if (paramMap.has('icmHost') && paramMap.get('icmHost') !== 'default') {
    const scheme = paramMap.get('icmScheme') || 'https';
    const port = paramMap.get('icmPort') || '443';
    properties.baseURL = `${scheme}://${paramMap.get('icmHost')}:${port}`;
  }

  if (paramMap.has('features') && paramMap.get('features') !== 'default') {
    if (paramMap.get('features') === 'none') {
      properties.features = [];
    } else {
      properties.features = paramMap.get<string>('features').split(/,/g) as FeatureToggleType[];
    }
  }

  if (paramMap.has('addFeatures')) {
    properties.addFeatures = paramMap.get<string>('addFeatures').split(/,/g) as FeatureToggleType[];
  }

  if (paramMap.has('device')) {
    properties._deviceType = paramMap.get('device');
  }

  if (paramMap.has('sparque')) {
    properties.sparque = mapSparqueConfig(paramMap.get<string>('sparque'));
  }

  if (Object.keys(properties).length) {
    return configurationReducer(state, applyConfiguration(properties));
  }
  return state;
}

function mapSparqueConfig(sparque: string): SparqueConfig {
  const sparqueParam = new Map(sparque.split(',').map(item => item.split('=') as [string, string]));
  const sparqueConfig = getEmptySparqueConfig();
  Object.getOwnPropertyNames(sparqueConfig).forEach(key => {
    sparqueConfig[key] = decodeURIComponent(sparqueParam.get(key));
  });

  return sparqueConfig;
}

/**
 * meta reducer for overriding client side state if supplied by server
 */
export function configurationMeta(reducer: ActionReducer<CoreState>): ActionReducer<CoreState> {
  let first = false;

  return (
    state: CoreState,
    action: typeof routerNavigationAction & { payload: RouterNavigationPayload<RouterState> }
  ) => {
    let newState = state;
    if (!first && action.type === routerNavigationAction.type) {
      const payload = action.payload;
      const paramMap = new SimpleParamMap(payload.routerState.params);
      newState = mergeDeep(newState, {
        configuration: extractConfigurationParameters(newState.configuration, paramMap),
      });
      first = true;
    }

    return reducer(newState, action);
  };
}
