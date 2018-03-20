export const environment = {
  production: true,
  needMock: false,
  // mustMockPaths: [],
  icmBaseURL: 'http://192.168.99.100:8081',
  icmServer: 'INTERSHOP/rest/WFS',
  icmApplication: 'inSPIRED-inTRONICS-Site',
  mainNavigationMaxSubCategoriesDepth: 2,

  locales: [
    { lang: 'en_US', currency: 'USD', value: 'en', displayName: 'English' },
    { lang: 'de_DE', currency: 'EUR', value: 'de', displayName: 'German' },
    { lang: 'fr_FR', currency: 'EUR', value: 'fr', displayName: 'French' }
  ]
};
