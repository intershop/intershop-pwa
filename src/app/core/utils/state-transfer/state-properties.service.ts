import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, identity } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigurationType, getConfigurationState } from 'ish-core/store/core/configuration';
import { mapToProperty } from 'ish-core/utils/operators';

import { environment } from '../../../../environments/environment';
import { Environment } from '../../../../environments/environment.model';

function isJSON(value: string): boolean {
  return value.trim().startsWith('{');
}

function isYAML(value: string) {
  const lines = value.split('\n').filter(x => !!x?.trim());
  return (
    (lines.length > 1 && value.split('\n').some(line => /:\s*$/.test(line))) ||
    lines.every(line => line.includes(': ') || lines.every(line => line.trim().startsWith('- ')))
  );
}

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
      mapToProperty(envPropKey as keyof ConfigurationType),
      map(value => {
        if (value !== undefined) {
          return value;
        } else if (SSR && process.env[envKey]) {
          return process.env[envKey];
        } else {
          return environment[envPropKey];
        }
      }),
      SSR
        ? map(value => {
            if (typeof value === 'string') {
              if (isJSON(value)) {
                return JSON.parse(value);
              } else if (isYAML(value)) {
                // import js-yaml with require so it doesn't turn up in the client bundle
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                return require('js-yaml').load(value);
              }
            }
            return value;
          })
        : identity
    );
  }
}
