import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getICMWebURL } from 'ish-core/store/hybrid';

import { HYBRID_MAPPING_TABLE } from '../../../hybrid/default-url-mapping-table';

@Injectable({ providedIn: 'root' })
export class HybridRedirectGuard implements CanActivate, CanActivateChild {
  constructor(private store$: Store) {}

  private checkRedirect(url: string): boolean | Observable<boolean> {
    return this.store$.pipe(
      select(getICMWebURL),
      map(icmWebUrl => {
        for (const entry of HYBRID_MAPPING_TABLE) {
          if (entry.handledBy === 'pwa') {
            continue;
          }
          const regex = new RegExp(entry.pwa);
          if (regex.exec(url)) {
            const newUrl = url.replace(regex, `${icmWebUrl}/${entry.icmBuild}`);
            location.assign(newUrl);
            return false;
          }
        }
        return true;
      })
    );
  }

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkRedirect(state.url);
  }

  canActivateChild(_: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkRedirect(state.url);
  }
}
