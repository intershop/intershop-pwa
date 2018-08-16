import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { StateKey, TransferState, makeStateKey } from '@angular/platform-browser';

// tslint:disable-next-line: do-not-import-environment
import { environment } from '../../../../environments/environment';

export const ICM_BASE_URL_SK = makeStateKey<string>('icmBaseURL');
export const ICM_APPLICATION_SK = makeStateKey<string>('icmApplication');
export const ICM_SERVER_SK = makeStateKey<string>('icmServer');

/**
 * Service for retrieving injection properties {@link ICM_BASE_URL} and {@link REST_ENDPOINT}.
 * Do not use service directly, inject properties with supplied factory methods instead.
 */
@Injectable({ providedIn: 'root' })
export class StatePropertiesService {
  constructor(private transferState: TransferState, @Inject(PLATFORM_ID) private platformId: string) {}

  /**
   * Retrieve property from first set property of server state, system environment or environment.ts
   */
  getStateOrEnvOrDefault(key: StateKey<string>, envKey: string, envPropKey: string): string {
    if (this.transferState.hasKey(key)) {
      return this.transferState.get(key, undefined);
    } else if (isPlatformServer(this.platformId) && !!process.env[envKey]) {
      return process.env[envKey];
    } else {
      return environment[envPropKey];
    }
  }

  getICMBaseURL(): string {
    return this.getStateOrEnvOrDefault(ICM_BASE_URL_SK, 'ICM_BASE_URL', 'icmBaseURL');
  }

  getICMServer(): string {
    return this.getStateOrEnvOrDefault(ICM_SERVER_SK, 'ICM_SERVER', 'icmServer');
  }

  getICMApplication(): string {
    return this.getStateOrEnvOrDefault(ICM_APPLICATION_SK, 'ICM_APPLICATION', 'icmApplication');
  }

  getICMServerURL(): string {
    return `${this.getICMBaseURL()}/${this.getICMServer()}`;
  }

  getRestEndPoint(): string {
    return `${this.getICMServerURL()}/${this.getICMApplication()}/-`;
  }
}
