import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, withLatestFrom } from 'rxjs/operators';

import { CountryService } from 'ish-core/services/country/country.service';
import { mapErrorToAction } from 'ish-core/utils/operators';

import * as countryActions from './countries.actions';
import { getAllCountries } from './countries.selectors';

@Injectable()
export class CountriesEffects {
  constructor(private actions$: Actions, private store: Store<{}>, private countryService: CountryService) {}

  @Effect()
  loadCountries$ = this.actions$.pipe(
    ofType(countryActions.CountryActionTypes.LoadCountries),
    withLatestFrom(this.store.pipe(select(getAllCountries))),
    filter(([, countries]) => !countries.length),
    concatMap(() =>
      this.countryService.getCountries().pipe(
        map(countries => new countryActions.LoadCountriesSuccess({ countries })),
        mapErrorToAction(countryActions.LoadCountriesFail)
      )
    )
  );
}
