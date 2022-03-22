import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getConfigurationState } from 'ish-core/store/core/configuration';
import { mapToProperty } from 'ish-core/utils/operators';

import { environment } from '../../../../environments/environment';
import { Environment } from '../../../../environments/environment.model';

/**
 * Service for retrieving injection properties {@link ICM_BASE_URL} and {@link REST_ENDPOINT}.
 * Do not use service directly, inject properties with supplied factory methods instead.
 */
@Injectable({ providedIn: 'root' })
export class StatePropertiesService {
  constructor(private store: Store) {}

  /**
   * Retrieve property from first set property of server state, system environment or environment.ts
   */
  getStateOrEnvOrDefault<T>(envKey: string, envPropKey: keyof Environment): Observable<T> {
    return this.store.pipe(
      select(getConfigurationState),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- re-mapping type
      mapToProperty(envPropKey as any),
      map(value => {
        if (value?.length) {
          return value;
        } else if (SSR && process.env[envKey]) {
          return process.env[envKey];
        } else {
          return environment[envPropKey];
        }
      })
    );
  }
}
