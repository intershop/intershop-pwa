import { ENVIRONMENT_DEFAULTS, Environment } from './environment.model';

export const environment: Environment = {
  ...ENVIRONMENT_DEFAULTS,
  production: true,
  serviceWorker: false,

  /* INTERSHOP COMMERCE MANAGEMENT REST API CONFIGURATION */
  icmBaseURL: 'https://intershoppwa.azurewebsites.net',
  features: ['compare', 'recently', 'rating', 'wishlists', 'tracking'],
  gtmToken: 'GTM-WW6PGFW',
};
