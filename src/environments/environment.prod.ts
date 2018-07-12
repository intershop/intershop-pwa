export const environment = {
  production: true,
  needMock: false,
  // mustMockPaths: [],

  // Intershop Commerce Management REST server configuration
  icmBaseURL: 'http://192.168.99.100:8081',
  icmServer: 'INTERSHOP/rest/WFS',
  icmApplication: 'inSPIRED-inTRONICS-Site',

  // configuration of the available locales - hard coded for now
  locales: [
    { lang: 'en_US', currency: 'USD', value: 'en', displayName: 'English', displayLong: 'English (United States)' },
    { lang: 'de_DE', currency: 'EUR', value: 'de', displayName: 'German', displayLong: 'German (Germany)' },
    { lang: 'fr_FR', currency: 'EUR', value: 'fr', displayName: 'French', displayLong: 'French (France)' },
  ],

  // global definition of the maximal depth of the main navigation sub categories
  mainNavigationMaxSubCategoriesDepth: 2,

  // experimental feature: enable the transfer of the application state to another tab or keep it after a full page refresh/load - disabled for now
  syncLocalStorage: false,

  // experimental feature: enable feature toggles for specific features
  features: {
    compare: true,
    recently: true,
    quoting: false,
  },
};
