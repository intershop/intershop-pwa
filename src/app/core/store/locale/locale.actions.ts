import { Action } from '@ngrx/store';
import { Locale } from '../../../models/locale/locale.interface';

export enum LocaleActionTypes {
  SelectLocale = '[Locale] Set Locale'
}

export class SelectLocale implements Action {
  readonly type = LocaleActionTypes.SelectLocale;
  constructor(public payload: Locale) { }
}

export type LocaleAction = SelectLocale;
