// tslint:disable:ban-specific-imports
import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

/**
 * Service for retrieving injection properties {@link ICM_BASE_URL} and {@link REST_ENDPOINT}.
 * Do not use service directly, inject properties with supplied factory methods instead.
 */
@Injectable({ providedIn: 'root' })
export class StatePropertiesService {
  constructor(private store: Store<{}>, @Inject(PLATFORM_ID) private platformId: string) {}

  /**
   * Retrieve property from first set property of server state, system environment or environment.ts
   */
  getStateOrEnvOrDefault<T>(envKey: string, envPropKey: string): Observable<T> {
    return this.store.pipe(
      pluck(`configuration.${envPropKey}`),
      map(value => {
        if (value) {
          return value;
        } else if (isPlatformServer(this.platformId) && process.env[envKey]) {
          return process.env[envKey];
        } else {
          return environment[envPropKey];
        }
      })
    );
  }
}
