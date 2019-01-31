import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, withLatestFrom } from 'rxjs/operators';

import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';
import { CountryService } from '../../services/country/country.service';

import * as regionActions from './regions.actions';
import { getAllRegions } from './regions.selectors';

@Injectable()
export class RegionsEffects {
  constructor(private actions$: Actions, private store: Store<{}>, private countryService: CountryService) {}

  @Effect()
  loadRegions$ = this.actions$.pipe(
    ofType(regionActions.RegionActionTypes.LoadRegions),
    mapToPayloadProperty('countryCode'),
    withLatestFrom(this.store.pipe(select(getAllRegions))),
    filter(([countryCode, allRegions]) => !allRegions.some(r => r.countryCode === countryCode)),
    concatMap(([countryCode]) =>
      this.countryService.getRegionsByCountry(countryCode).pipe(
        map(regions => new regionActions.LoadRegionsSuccess({ regions })),
        mapErrorToAction(regionActions.LoadRegionsFail)
      )
    )
  );
}
