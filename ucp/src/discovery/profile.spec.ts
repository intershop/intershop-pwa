import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildUcpProfile } from './profile';

describe('buildUcpProfile', () => {
  it('declares the catalog Search and Lookup capabilities over REST', () => {
    const profile = buildUcpProfile('https://ucp.example.com') as {
      ucp: {
        services: Record<string, { endpoint: string; transport: string; spec: string; schema: string }[]>;
        capabilities: Record<string, { spec: string; schema: string }[]>;
      };
    };

    const service = profile.ucp.services['dev.ucp.shopping'][0];
    assert.equal(service.transport, 'rest');
    assert.equal(service.endpoint, 'https://ucp.example.com/ucp/v1');
    // Required discovery links (spec + schema) must be present and non-empty.
    assert.match(service.spec, /^https:\/\/ucp\.dev\//);
    assert.equal(service.schema, 'https://ucp.example.com/ucp/v1/openapi.json');

    const capabilities = Object.keys(profile.ucp.capabilities);
    assert.ok(capabilities.includes('dev.ucp.shopping.catalog.search'));
    assert.ok(capabilities.includes('dev.ucp.shopping.catalog.lookup'));

    // Every declared capability MUST carry both a spec and a schema link (UCP conformance).
    for (const entries of Object.values(profile.ucp.capabilities)) {
      assert.match(entries[0].spec, /^https:\/\/ucp\.dev\/.+\/specification\//);
      assert.match(entries[0].schema, /^https:\/\/ucp\.dev\/.+\/schemas\/.+\.json$/);
    }
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
