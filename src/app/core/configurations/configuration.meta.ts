import { Params } from '@angular/router';
import { RouterNavigationPayload, routerNavigationAction } from '@ngrx/router-store';
import { ActionReducer } from '@ngrx/store';

import { ApplyConfiguration } from 'ish-core/store/configuration';
import { ConfigurationState, configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { CoreState } from 'ish-core/store/core-store';
import { RouterState } from 'ish-core/store/router/router.reducer';
import { mergeDeep } from 'ish-core/utils/functions';

class SimpleParamMap {
  constructor(private obj: Params) {}
  has(key: string): boolean {
    return this.obj[key] !== undefined;
  }
  get(key: string): string {
    return this.obj[key];
  }
}

function extractConfigurationParameters(state: ConfigurationState, paramMap: SimpleParamMap) {
  const keys: (keyof ConfigurationState)[] = ['channel', 'application', 'theme', 'lang'];
  const properties: Partial<ConfigurationState> = keys
    .filter(key => paramMap.has(key) && paramMap.get(key) !== 'default')
    .map(key => ({ [key]: paramMap.get(key) }))
    .reduce((acc, val) => ({ ...acc, ...val }), {});

  if (paramMap.has('icmHost')) {
    properties.baseURL = `${paramMap.get('icmScheme') || 'https'}://${paramMap.get('icmHost')}`;
  }

  if (paramMap.has('features') && paramMap.get('features') !== 'default') {
    if (paramMap.get('features') === 'none') {
      properties.features = [];
    } else {
      properties.features = paramMap.get('features').split(/,/g);
    }
  }

  if (Object.keys(properties).length) {
    return configurationReducer(state, new ApplyConfiguration(properties));
  }
  return state;
}

// tslint:disable: no-any
/**
 * meta reducer for overriding client side state if supplied by server
 */
export function configurationMeta(reducer: ActionReducer<any>): ActionReducer<any> {
  let first = false;

  return (state: CoreState, action: any) => {
    let newState = state;
    if (!first && action.type === routerNavigationAction.type) {
      const payload: RouterNavigationPayload<RouterState> = action.payload;
      const paramMap = new SimpleParamMap(payload.routerState.params);
      newState = mergeDeep(newState, {
        configuration: extractConfigurationParameters(newState.configuration, paramMap),
      });
      first = true;
    }

    return reducer(newState, action);
  };
}
