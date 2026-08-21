import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildUcpProfile } from './profile';

describe('buildUcpProfile', () => {
  it('declares the catalog Search and Lookup capabilities over REST', () => {
    const profile = buildUcpProfile('https://ucp.example.com') as {
      ucp: {
        services: Record<string, { endpoint: string; transport: string }[]>;
        capabilities: Record<string, unknown[]>;
      };
    };

    const service = profile.ucp.services['dev.ucp.shopping'][0];
    assert.equal(service.transport, 'rest');
    assert.equal(service.endpoint, 'https://ucp.example.com/ucp/v1');

    const capabilities = Object.keys(profile.ucp.capabilities);
    assert.ok(capabilities.includes('dev.ucp.shopping.catalog.search'));
    assert.ok(capabilities.includes('dev.ucp.shopping.catalog.lookup'));
  });

  it('declares no transactional capabilities', () => {
    const profile = buildUcpProfile('https://ucp.example.com') as {
      ucp: { capabilities: Record<string, unknown[]> };
    };

    const capabilities = Object.keys(profile.ucp.capabilities).join(' ');
    for (const forbidden of ['cart', 'checkout', 'payment', 'order']) {
      assert.equal(capabilities.includes(forbidden), false);
    }
  });
});
