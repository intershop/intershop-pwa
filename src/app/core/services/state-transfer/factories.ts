import { InjectionToken } from '@angular/core';
import { StatePropertiesService } from './state-properties.service';

/**
 * The injected property contains the URL to the rest endpoint of the ICM Application.
 * It is set by {@link StatePropertiesService#getRestEndPoint}
 */
export const REST_ENDPOINT = new InjectionToken<string>('restEndpoint');

export function getRestEndPoint() {
  return (service: StatePropertiesService): string => service.getRestEndPoint();
}

/**
 * The injected property contains the base URL to the ICM Application to be used for constructing paths to static data.
 * It is set by {@link StatePropertiesService#getICMBaseURL}
 */
export const ICM_BASE_URL = new InjectionToken<string>('icmBaseURL');

export function getICMBaseURL() {
  return (service: StatePropertiesService): string => service.getICMBaseURL();
}

/**
 * The injected property contains the name of the connected ICM Site.
 * It is set by {@link StatePropertiesService#getICMApplication}
 */
export const ICM_APPLICATION = new InjectionToken<string>('icmApplication');

export function getICMApplication() {
  return (service: StatePropertiesService): string => service.getICMApplication();
}

/**
 * The injected property contains the URL of the connected ICM Server.
 * It is set by {@link StatePropertiesService#getICMServer}
 */
export const ICM_SERVER_URL = new InjectionToken<string>('icmServerURL');

export function getICMServerURL() {
  return (service: StatePropertiesService): string => service.getICMServerURL();
}
