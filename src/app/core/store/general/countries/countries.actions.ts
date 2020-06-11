import { createAction } from '@ngrx/store';

import { Country } from 'ish-core/models/country/country.model';
import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const loadCountries = createAction('[Core] Load Countries');

export const loadCountriesFail = createAction('[Core] Load Countries Fail', httpError());

export const loadCountriesSuccess = createAction('[Core] Load Countries Success', payload<{ countries: Country[] }>());
