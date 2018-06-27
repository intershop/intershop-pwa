// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --prod` then `environment.prod.ts` will be used instead.
// The list of which configuration maps to which file can be found in `angular.json`.

export const environment = {
  production: false,
  needMock: true,
  icmBaseURL: 'http://localhost:4200',
  icmServer: 'INTERSHOP/rest/WFS',
  icmApplication: 'inSPIRED-inTRONICS-Site',
  mainNavigationMaxSubCategoriesDepth: 2,
  syncLocalStorage: false, // experimental feature to transfer the application state to another tab or keep it after a full page refresh/load - disabled for now

  locales: [
    { lang: 'en_US', currency: 'USD', value: 'en', displayName: 'English', displayLong: 'English (United States)' },
    { lang: 'de_DE', currency: 'EUR', value: 'de', displayName: 'German', displayLong: 'German (Germany)' },
    { lang: 'fr_FR', currency: 'EUR', value: 'fr', displayName: 'French', displayLong: 'French (France)' },
  ],
};
