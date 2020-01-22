import { createSelector } from '@ngrx/store';

import { getConfigurationState, getICMApplication } from 'ish-core/store/configuration';
import { getCurrentLocale } from 'ish-core/store/locale';

import { ICM_WEB_URL } from '../../../../hybrid/default-url-mapping-table';

export const getICMWebURL = createSelector(
  getConfigurationState,
  getCurrentLocale,
  getICMApplication,
  (state, locale, application) =>
    ICM_WEB_URL.replace('$<channel>', state.channel)
      .replace('$<lang>', locale.lang)
      .replace('$<application>', application)
      .replace('$<currency>', locale.currency)
);
