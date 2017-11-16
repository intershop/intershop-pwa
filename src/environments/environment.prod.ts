export const environment = {
  platformId: '',
  production: true,
  needMock: false,
  mustMockPaths: [
    'categories/Specials',
    'createUser'
  ],
  rest_url: 'http://192.168.99.100:8081/INTERSHOP/rest/WFS/inSPIRED-inTRONICS-Site/-',
  base_url: 'http://192.168.99.100:8081',

  locales: [
    { 'lang': 'en_US', 'currency': 'USD', value: 'en', displayName: 'English' },
    { 'lang': 'de_DE', 'currency': 'EUR', value: 'de', displayName: 'German' },
    { 'lang': 'fr_FR', 'currency': 'EUR', value: 'fr', displayName: 'French' }
  ]
};
