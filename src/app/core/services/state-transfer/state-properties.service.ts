import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { StateKey } from '@angular/platform-browser/src/browser/transfer_state';
// tslint:disable-next-line: do-not-import-environment
import { environment } from '../../../../environments/environment';

export const ICM_BASE_URL_SK = makeStateKey<string>('icmBaseURL');
export const ICM_APPLICATION_SK = makeStateKey<string>('icmApplication');
export const ICM_SERVER_SK = makeStateKey<string>('icmServer');

/**
 * Service for retrieving injection properties {@link ICM_BASE_URL} and {@link REST_ENDPOINT}.
 * Do not use service directly, inject properties with supplied factory methods instead.
 */
@Injectable()
export class StatePropertiesService {

  constructor(
    private transferState: TransferState
  ) { }

  /**
   * Retrieve property from first set property of server state, system environment or environment.ts
   */
  getStateOrEnvOrDefault(key: StateKey<string>, envKey: string, envPropKey: string): string {
    if (this.transferState.hasKey(key)) {
      return this.transferState.get(key, null);
    } else if (!!process.env[envKey]) {
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
