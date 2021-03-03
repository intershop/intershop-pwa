import { Params } from '@angular/router';
import { RouterNavigationPayload, routerNavigationAction } from '@ngrx/router-store';
import { ActionReducer } from '@ngrx/store';

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

function extractConfigurationParameters(state: ConfigurationState, paramMap: SimpleParamMap) {
  const keys: (keyof ConfigurationState)[] = ['channel', 'application', 'theme', 'lang', 'identityProvider'];
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
      properties.features = paramMap.get<string>('features').split(/,/g);
    }
  }

  if (paramMap.has('device')) {
    properties._deviceType = paramMap.get('device');
  }

  if (Object.keys(properties).length) {
    return configurationReducer(state, applyConfiguration(properties));
  }
  return state;
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
