import { Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CountryService } from '../../services/countries/country.service';
import * as countryActions from './countries.actions';

@Injectable()
export class CountriesEffects {
  constructor(private actions$: Actions, private countryService: CountryService) {}

  @Effect()
  loadCountries$ = this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    switchMap(() => {
      return this.countryService.getCountries().pipe(
        map(countries => new countryActions.LoadCountriesSuccess(countries)),
        catchError(error => of(new countryActions.LoadCountriesFail(error)))
      );
    })
  );
}
