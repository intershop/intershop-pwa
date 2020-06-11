import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, withLatestFrom } from 'rxjs/operators';

import { CountryService } from 'ish-core/services/country/country.service';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import { loadRegions, loadRegionsFail, loadRegionsSuccess } from './regions.actions';
import { getAllRegions } from './regions.selectors';

@Injectable()
export class RegionsEffects {
  constructor(private actions$: Actions, private store: Store, private countryService: CountryService) {}

  loadRegions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRegions),
      mapToPayloadProperty('countryCode'),
      withLatestFrom(this.store.pipe(select(getAllRegions))),
      filter(([countryCode, allRegions]) => !allRegions.some(r => r.countryCode === countryCode)),
      concatMap(([countryCode]) =>
        this.countryService.getRegionsByCountry(countryCode).pipe(
          map(regions => loadRegionsSuccess({ regions })),
          mapErrorToAction(loadRegionsFail)
        )
      )
    )
  );
}
