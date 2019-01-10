import { EntityState, createEntityAdapter } from '@ngrx/entity';

import { Locale } from '../../models/locale/locale.model';

import { LocaleAction, LocaleActionTypes } from './locale.actions';

export interface LocaleState extends EntityState<Locale> {
  current: string;
}

export const adapter = createEntityAdapter<Locale>({
  selectId: l => l.lang,
});

export const getCurrent = (state: LocaleState) =>
  state && state.entities && state.current ? state.entities[state.current] : undefined;

export const { selectAll: getAvailable } = adapter.getSelectors();

export const initialState: LocaleState = adapter.getInitialState({
  current: undefined,
});

export function localeReducer(state = initialState, action: LocaleAction): LocaleState {
  switch (action.type) {
    case LocaleActionTypes.SelectLocale: {
      const current = action.payload.locale.lang;
      return { ...state, current };
    }
    case LocaleActionTypes.SetAvailableLocales: {
      const { locales } = action.payload;
      const clearState = adapter.removeAll(state);
      return adapter.addMany(locales, clearState);
    }
  }
  return state;
}
