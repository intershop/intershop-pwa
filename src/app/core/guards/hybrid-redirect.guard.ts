import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getICMWebURL } from 'ish-core/store/hybrid';

import { HYBRID_MAPPING_TABLE } from '../../../hybrid/default-url-mapping-table';

/**
 * guard that handles the Hybrid Approach functionality on the browser side using the HYBRID_MAPPING_TABLE configuration
 */
export function hybridRedirectGuard(_: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  return checkRedirect(state.url);
}

function checkRedirect(url: string): boolean | Observable<boolean> {
  const store = inject(Store);

  return store.pipe(
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
