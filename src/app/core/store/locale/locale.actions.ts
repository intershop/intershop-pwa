import { Action } from '@ngrx/store';

import { Locale } from '../../../models/locale/locale.model';

export enum LocaleActionTypes {
  SelectLocale = '[Locale] Set Locale',
  SetAvailableLocales = '[Locale] Set Available Locales',
}

export class SelectLocale implements Action {
  readonly type = LocaleActionTypes.SelectLocale;
  constructor(public payload: Locale) {}
}

export class SetAvailableLocales implements Action {
  readonly type = LocaleActionTypes.SetAvailableLocales;
  constructor(public payload: Locale[]) {}
}

export type LocaleAction = SelectLocale | SetAvailableLocales;
