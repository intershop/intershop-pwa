import { InjectionToken } from '@angular/core';

import { environment } from '../../../environments/environment';
import { Environment } from '../../../environments/environment.model';

/**
 * Create an injection token for environment.ts properties
 */
export function createEnvironmentInjectionToken<K extends keyof Environment>(key: K) {
  return new InjectionToken<Environment[K]>(key, {
    factory: () => environment[key],
  });
}
