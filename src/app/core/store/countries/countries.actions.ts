import { Action } from '@ngrx/store';

import { Country } from 'ish-core/models/country/country.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

export enum CountryActionTypes {
  LoadCountries = '[Core] Load Countries',
  LoadCountriesFail = '[Core] Load Countries Fail',
  LoadCountriesSuccess = '[Core] Load Countries Success',
}

export class LoadCountries implements Action {
  readonly type = CountryActionTypes.LoadCountries;
}

export class LoadCountriesFail implements Action {
  readonly type = CountryActionTypes.LoadCountriesFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoadCountriesSuccess implements Action {
  readonly type = CountryActionTypes.LoadCountriesSuccess;
  constructor(public payload: { countries: Country[] }) {}
}

export type CountryAction = LoadCountries | LoadCountriesFail | LoadCountriesSuccess;
