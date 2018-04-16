import { Params } from '@angular/router';
import { Action } from '@ngrx/store';

interface ActionPayload {
  url: string;
  queryParams?: Params;
  params?: Params;
  path?: string;
}

export function navigateMockAction(state: ActionPayload) {
  return {
    payload: {
      routerState: { ...state },
      event: { id: 1 },
    },
    type: 'ROUTER_NAVIGATION',
  } as Action;
}
