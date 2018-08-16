import { Injectable } from '@angular/core';
import { Actions, Effect, ROOT_EFFECTS_INIT, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';

import { mapErrorToAction } from '../../../utils/operators';
import { CountryService } from '../../services/countries/country.service';

import * as countryActions from './countries.actions';

@Injectable()
export class CountriesEffects {
  constructor(private actions$: Actions, private countryService: CountryService) {}

  @Effect()
  loadCountries$ = this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    switchMap(() =>
      this.countryService.getCountries().pipe(
        map(countries => new countryActions.LoadCountriesSuccess(countries)),
        mapErrorToAction(countryActions.LoadCountriesFail)
      )
    )
  );
}
