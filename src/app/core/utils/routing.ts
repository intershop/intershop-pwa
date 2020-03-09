import { Router } from '@angular/router';

export function addGlobalGuard(
  router: Router,
  guard: unknown,
  config: { canActivate: boolean; canActivateChild: boolean } = { canActivate: true, canActivateChild: true }
) {
  router.config.forEach(route => {
    if (config.canActivate) {
      if (route.canActivate) {
        route.canActivate.push(guard);
      } else {
        route.canActivate = [guard];
      }
    }
    if (config.canActivateChild) {
      if (route.canActivateChild) {
        route.canActivateChild.push(guard);
      } else {
        route.canActivateChild = [guard];
      }
    }
  });
}
