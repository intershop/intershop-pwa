import { Params } from '@angular/router';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export const getURL = (state: RouterStateUrl): string => state.url;
