import { Action } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Region } from 'ish-core/models/region/region.model';

export enum RegionActionTypes {
  LoadRegions = '[Core] Load Regions',
  LoadRegionsFail = '[Core] Load Regions Fail',
  LoadRegionsSuccess = '[Core] Load Regions Success',
}

export class LoadRegions implements Action {
  readonly type = RegionActionTypes.LoadRegions;
  constructor(public payload: { countryCode: string }) {}
}

export class LoadRegionsFail implements Action {
  readonly type = RegionActionTypes.LoadRegionsFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoadRegionsSuccess implements Action {
  readonly type = RegionActionTypes.LoadRegionsSuccess;
  constructor(public payload: { regions: Region[] }) {}
}

export type RegionAction = LoadRegions | LoadRegionsFail | LoadRegionsSuccess;
