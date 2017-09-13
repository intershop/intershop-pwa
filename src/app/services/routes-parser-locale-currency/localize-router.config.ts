import { Inject, OpaqueToken, Provider } from '@angular/core';

/**
 * Guard to make sure we have single initialization of forRoot
 * @type {OpaqueToken<LocalizeRouterModule>}
 */
export const LOCALIZE_ROUTER_FORROOT_GUARD = new OpaqueToken('LOCALIZE_ROUTER_FORROOT_GUARD');

/**
 * Static provider for keeping track of routes
 * @type {OpaqueToken<Routes[]>}
 */
export const RAW_ROUTES = new OpaqueToken('RAW_ROUTES');

/**
 * Boolean to indicate whether prefix should be set for single language scenarios
 * @type {OpaqueToken<boolean>}
 */
export const ALWAYS_SET_PREFIX = new OpaqueToken('ALWAYS_SET_PREFIX');

/**
 * Config interface for LocalizeRouter
 */
export interface LocalizeRouterConfig {
  parser?: Provider;
  alwaysSetPrefix?: boolean;
}

export class LocalizeRouterSettings implements LocalizeRouterConfig {
  constructor(
    @Inject(ALWAYS_SET_PREFIX) public alwaysSetPrefix: boolean = true
  ) {
  }
}
