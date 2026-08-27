import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { UcpConfig } from '../config';

import { negotiate, negotiateCurrency, negotiateLocale, toContentLanguage } from './negotiation';

const config: UcpConfig = {
  port: 4000,
  icmBaseUrl: 'https://icm.example.com',
  icmServer: 'INTERSHOP/rest/WFS',
  icmChannel: 'inSPIRED-inTRONICS_Business-Site',
  icmApplication: '-',
  locale: 'en_US',
  currency: 'USD',
  supportedLocales: ['en_US', 'de_DE'],
  supportedCurrencies: ['USD', 'EUR'],
  markets: [],
};

describe('negotiateLocale', () => {
  it('falls back to the default when no header is present', () => {
    assert.equal(negotiateLocale(undefined, config), 'en_US');
  });

  it('matches an exact BCP-47 tag against a supported ICM locale', () => {
    assert.equal(negotiateLocale('de-DE', config), 'de_DE');
  });

  it('matches a language-only tag to a supported locale', () => {
    assert.equal(negotiateLocale('de', config), 'de_DE');
  });

  it('honours q-values and skips unsupported tags', () => {
    assert.equal(negotiateLocale('fr-FR,de;q=0.9,en;q=0.8', config), 'de_DE');
  });

  it('falls back to the default for an unsupported language', () => {
    assert.equal(negotiateLocale('ja-JP', config), 'en_US');
  });
});

describe('negotiateCurrency', () => {
  it('falls back to the default when no header is present', () => {
    assert.equal(negotiateCurrency(undefined, config), 'USD');
  });

  it('selects a supported currency case-insensitively', () => {
    assert.equal(negotiateCurrency('eur', config), 'EUR');
  });

  it('picks the first supported currency from a list', () => {
    assert.equal(negotiateCurrency('JPY, EUR', config), 'EUR');
  });

  it('falls back to the default for an unsupported currency', () => {
    assert.equal(negotiateCurrency('JPY', config), 'USD');
  });
});

describe('negotiate', () => {
  it('combines the negotiated locale and currency', () => {
    const result = negotiate({ acceptLanguage: 'de-DE', acceptCurrency: 'EUR' }, config);
    assert.deepEqual(result, { locale: 'de_DE', currency: 'EUR' });
  });
});

describe('toContentLanguage', () => {
  it('renders an ICM locale as a BCP-47 tag', () => {
    assert.equal(toContentLanguage('en_US'), 'en-US');
  });
});
