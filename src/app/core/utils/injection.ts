import { InjectionToken } from '@angular/core';

import { environment } from '../../../environments/environment';
import { Environment } from '../../../environments/environment.model';

/**
 * Wrapper for type safe injection of injection tokens supplied without `multi: true`
 */
export type InjectSingle<T> = T extends InjectionToken<infer U> ? U : never;

/**
 * Wrapper for type safe injection of injection tokens supplied with `multi: true`
 */
export type InjectMultiple<T> = T extends InjectionToken<infer U> ? U[] : never;

/**
 * Create an injection token for environment.ts properties
 */
export function createEnvironmentInjectionToken<K extends keyof Environment>(key: K) {
  return new InjectionToken<Environment[K]>(key, {
    factory: () => environment[key],
  });
}
