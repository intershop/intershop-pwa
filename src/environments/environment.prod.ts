export const environment = {
  production: true,
  needMock: false,
  mustMockPaths: [
    'categories/Specials',
    'createUser'
  ],
  icmBaseURL: 'http://10.0.79.1:81',
  icmApplication: 'inSPIRED-inTRONICS-Site',

  locales: [
    { 'lang': 'en_US', 'currency': 'USD', value: 'en', displayName: 'English' },
    { 'lang': 'de_DE', 'currency': 'EUR', value: 'de', displayName: 'German' },
    { 'lang': 'fr_FR', 'currency': 'EUR', value: 'fr', displayName: 'French' }
  ]
};
