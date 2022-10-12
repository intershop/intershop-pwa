import { createSelector } from '@ngrx/store';

import {
  getConfigurationState,
  getCurrentCurrency,
  getCurrentLocale,
  getResponsiveStarterStoreApplication,
} from 'ish-core/store/core/configuration';

import { ICM_WEB_URL } from '../../../../hybrid/default-url-mapping-table';

export const getICMWebURL = createSelector(
  getConfigurationState,
  getCurrentLocale,
  getCurrentCurrency,
  getResponsiveStarterStoreApplication,
  (state, locale, currency, application) =>
    ICM_WEB_URL.replace('$<channel>', state.channel)
      .replace('$<lang>', locale)
      .replace('$<application>', application)
      .replace('$<currency>', currency)
);
