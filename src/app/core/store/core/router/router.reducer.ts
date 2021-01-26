import { Data, Params } from '@angular/router';
import { BaseRouterStoreState } from '@ngrx/router-store';

export interface RouterState extends BaseRouterStoreState {
  params: Params;
  queryParams: Params;
  data: Data;
  path: string;
}
