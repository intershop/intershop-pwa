import { createAction } from '@ngrx/store';

import { Country } from 'ish-core/models/country/country.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadCountries = createAction('[Countries Internal] Load Countries');

export const loadCountriesFail = createAction('[Countries API] Load Countries Fail', httpError());

export const loadCountriesSuccess = createAction(
  '[Countries API] Load Countries Success',
  payload<{ countries: Country[] }>()
);
