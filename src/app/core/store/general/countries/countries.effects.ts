import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, withLatestFrom } from 'rxjs/operators';

import { CountryService } from 'ish-core/services/country/country.service';
import { mapErrorToAction } from 'ish-core/utils/operators';

import { loadCountries, loadCountriesFail, loadCountriesSuccess } from './countries.actions';
import { getAllCountries } from './countries.selectors';

@Injectable()
export class CountriesEffects {
  constructor(private actions$: Actions, private store: Store, private countryService: CountryService) {}

  loadCountries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCountries),
      withLatestFrom(this.store.pipe(select(getAllCountries))),
      filter(([, countries]) => !countries.length),
      concatMap(() =>
        this.countryService.getCountries().pipe(
          map(countries => loadCountriesSuccess({ countries })),
          mapErrorToAction(loadCountriesFail)
        )
      )
    )
  );
}
