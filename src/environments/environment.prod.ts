export const environment = {
  platformId: '',
  production: true,
  needMock: false,
  mustMockPaths: [
    'categories/Specials'
  ],
  rest_url: 'https://localhost:8444/INTERSHOP/rest/WFS/inSPIRED-inTRONICS-Site/-',
  base_url: 'https://localhost:8444',

  locales: [
    { 'lang': 'en_US', 'currency': 'USD', value: 'English', displayValue: 'en' },
    { 'lang': 'de_DE', 'currency': 'EUR', value: 'German', displayValue: 'de' }
  ],
  prefix: 'ROUTES',
  pattern: '{LANG}/{CURRENCY}'
};
