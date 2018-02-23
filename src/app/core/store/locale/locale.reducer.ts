import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Locale } from '../../../models/locale/locale.interface';
import { LocaleAction, LocaleActionTypes, SetAvailableLocales } from './locale.actions';

export interface LocaleState extends EntityState<Locale> {
  current: string | null;
}

export const adapter: EntityAdapter<Locale> = createEntityAdapter<Locale>({
  selectId: l => l.lang
});

export const getCurrent = (state: LocaleState) => (state.entities && state.current) ? state.entities[state.current] : null;

export const {
  selectAll: getAvailable
} = adapter.getSelectors();

export const initialState: LocaleState = adapter.getInitialState({
  current: null,
});

export function localeReducer(
  state = initialState,
  action: LocaleAction
): LocaleState {
  switch (action.type) {
    case LocaleActionTypes.SelectLocale: {
      const idx = action.payload.lang;
      return { ...state, current: idx };
    }
    case LocaleActionTypes.SetAvailableLocales: {
      const available = (action as SetAvailableLocales).payload;
      const clearState = adapter.removeAll(state);
      return adapter.addMany(available, clearState);
    }
  }
  return state;
}
