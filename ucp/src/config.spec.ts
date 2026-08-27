import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { UcpConfig, resolveMarket } from './config';

const base: UcpConfig = {
  port: 4000,
  publicBaseUrl: 'https://ucp.example.com',
  storefrontBaseUrl: 'https://shop.example.com',
  icmBaseUrl: 'https://icm.example.com',
  icmServer: 'INTERSHOP/rest/WFS',
  icmChannel: 'default-channel',
  icmApplication: '-',
  locale: 'en_US',
  currency: 'USD',
  supportedLocales: ['en_US'],
  supportedCurrencies: ['USD'],
  markets: [],
};

describe('resolveMarket', () => {
  it('returns the base config unchanged when no markets are configured', () => {
    assert.equal(resolveMarket(base, 'foo.com'), base);
  });

  it('returns the base config when the host matches no market', () => {
    const config = { ...base, markets: [{ host: 'foo.com', icmChannel: 'foo-channel' }] };
    assert.equal(resolveMarket(config, 'bar.com'), config);
  });

  it('resolves the channel for a matching host (case-insensitive, port ignored)', () => {
    const config = { ...base, markets: [{ host: 'Foo.com', icmChannel: 'foo-channel' }] };
    assert.equal(resolveMarket(config, 'foo.com:8080').icmChannel, 'foo-channel');
  });

  it('matches any host in a market host array', () => {
    const config = { ...base, markets: [{ host: ['a.com', 'b.com'], icmChannel: 'ab-channel' }] };
    assert.equal(resolveMarket(config, 'b.com').icmChannel, 'ab-channel');
  });

  it('applies per-market overrides and keeps the market default first in the advertised sets', () => {
    const config: UcpConfig = {
      ...base,
      markets: [
        {
          host: 'de.example.com',
          icmChannel: 'de-channel',
          locale: 'de_DE',
          currency: 'EUR',
          supportedLocales: ['fr_FR'],
          storefrontBaseUrl: 'https://shop.de/',
          publicBaseUrl: 'https://ucp.de/',
        },
      ],
    };
    const resolved = resolveMarket(config, 'de.example.com');
    assert.equal(resolved.locale, 'de_DE');
    assert.equal(resolved.currency, 'EUR');
    assert.deepEqual(resolved.supportedLocales, ['de_DE', 'fr_FR']);
    assert.deepEqual(resolved.supportedCurrencies, ['EUR', 'USD']);
    assert.equal(resolved.storefrontBaseUrl, 'https://shop.de');
    assert.equal(resolved.publicBaseUrl, 'https://ucp.de');
  });

  it('falls back to global values for omitted market fields', () => {
    const config = { ...base, markets: [{ host: 'foo.com', icmChannel: 'foo-channel' }] };
    const resolved = resolveMarket(config, 'foo.com');
    assert.equal(resolved.locale, 'en_US');
    assert.equal(resolved.currency, 'USD');
    assert.equal(resolved.storefrontBaseUrl, 'https://shop.example.com');
    assert.equal(resolved.publicBaseUrl, 'https://ucp.example.com');
  });
});
