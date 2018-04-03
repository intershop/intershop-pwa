import { Params } from '@angular/router';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';

interface ActionPayload {
  url: string;
  queryParams?: Params;
  params?: Params;
}

export function navigateMockAction(state: ActionPayload) {
  return {
    payload: {
      routerState: { ...state },
      event: { id: 1 }
    },
    type: ROUTER_NAVIGATION
  } as RouterNavigationAction;
}
