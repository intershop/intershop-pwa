import { NavigationExtras } from '@angular/router';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';

interface ActionPayload {
  url: string;
  queryParams?: any;
  params?: any;
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
