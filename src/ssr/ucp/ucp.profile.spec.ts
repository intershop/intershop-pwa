import { buildUcpProfile } from './ucp.profile';

describe('Ucp Profile', () => {
  const profile = buildUcpProfile('https://shop.example.com') as {
    ucp: {
      version: string;
      services: Record<string, unknown[]>;
      capabilities: Record<string, unknown[]>;
    };
  };

  it('should advertise the shopping service with a REST endpoint', () => {
    expect(profile.ucp.services['dev.ucp.shopping']).toEqual([
      expect.objectContaining({ transport: 'rest', endpoint: 'https://shop.example.com/ucp/v1' }),
    ]);
  });

  it('should declare only the non-transactional catalog capabilities', () => {
    expect(Object.keys(profile.ucp.capabilities)).toEqual([
      'dev.ucp.shopping.catalog.search',
      'dev.ucp.shopping.catalog.lookup',
    ]);
  });

  it('should not declare any transactional capability', () => {
    const capabilities = Object.keys(profile.ucp.capabilities).join(' ');

    expect(capabilities).not.toMatch(/cart|checkout|payment|order/);
  });
});
