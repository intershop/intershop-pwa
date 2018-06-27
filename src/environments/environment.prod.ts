export const environment = {
  production: true,
  needMock: false,
  // mustMockPaths: [],
  icmBaseURL: 'http://192.168.99.100:8081',
  // icmBaseURL: 'https://192.168.99.100:8444', // TODO: should be default for PWA but caused problems on Linux and needs further evaluation
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
