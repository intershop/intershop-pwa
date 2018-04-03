import { HttpErrorResponse } from '@angular/common/http';
import { Action } from '@ngrx/store';
import { Country } from '../../../models/country/country.model';

export enum CountryActionTypes {
  LoadCountries = '[Core] Load Countries',
  LoadCountriesFail = '[Core] Load Countries Fail',
  LoadCountriesSuccess = '[Core] Load Countries Success'
}

export class LoadCountries implements Action {
  readonly type = CountryActionTypes.LoadCountries;
}

export class LoadCountriesFail implements Action {
  readonly type = CountryActionTypes.LoadCountriesFail;
  constructor(public payload: HttpErrorResponse) { }
}

export class LoadCountriesSuccess implements Action {
  readonly type = CountryActionTypes.LoadCountriesSuccess;
  constructor(public payload: Country[]) { }
}

export type CountryAction = LoadCountries | LoadCountriesFail | LoadCountriesSuccess;
