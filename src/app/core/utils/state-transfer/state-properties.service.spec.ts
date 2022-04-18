import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { getConfigurationState } from 'ish-core/store/core/configuration';

import { StatePropertiesService } from './state-properties.service';

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('State Properties Service', () => {
  let service: StatePropertiesService;
  let store$: MockStore;

  beforeEach(() => {
    process.env.COMPLEX1 = `
      Auth0:
        type: Auth0
        clientId: clientId
        domain: domain`;
    process.env.COMPLEX2 = '{ "fr_FR": "/fr" }';
    process.env.SIMPLE1 = 'Auth0';
    process.env.SIMPLE3 = 'true';

    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });

    service = TestBed.inject(StatePropertiesService);
    store$ = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('on client', () => {
    beforeEach(() => {
      store$.overrideSelector(getConfigurationState, {
        complex1: {
          ICM: { type: 'ICM' },
        },
        complex2: {
          en_US: '/en',
          de_DE: '/de',
        },
        simple1: 'ICM',
        simple2: 'de_DE',
      } as any);
    });

    it('should retrieve complex1 from state', done => {
      service.getStateOrEnvOrDefault('COMPLEX1', 'complex1' as any).subscribe(complex1 => {
        expect(complex1).toMatchInlineSnapshot(`
          Object {
            "ICM": ICM,
          }
        `);
        done();
      });
    });

    it('should retrieve complex2 from state', done => {
      service.getStateOrEnvOrDefault('COMPLEX2', 'complex2' as any).subscribe(complex2 => {
        expect(complex2).toMatchInlineSnapshot(`
          Object {
            "de_DE": "/de",
            "en_US": "/en",
          }
        `);
        done();
      });
    });

    it('should retrieve simple1 from state', done => {
      service.getStateOrEnvOrDefault('SIMPLE1', 'simple1' as any).subscribe(simple1 => {
        expect(simple1).toMatchInlineSnapshot(`"ICM"`);
        done();
      });
    });

    it('should retrieve simple2 from state', done => {
      service.getStateOrEnvOrDefault('SIMPLE2', 'simple2' as any).subscribe(simple2 => {
        expect(simple2).toMatchInlineSnapshot(`"de_DE"`);
        done();
      });
    });

    it('should not have a value for simple3 because it does not check environment', done => {
      service.getStateOrEnvOrDefault('SIMPLE3', 'simple3' as any).subscribe(simple3 => {
        expect(simple3).toBeUndefined();
        done();
      });
    });
  });

  describe.onSSREnvironment('on server', () => {
    beforeEach(() => {
      store$.overrideSelector(getConfigurationState, { simple2: 'de_DE' } as any);
    });

    it('should retrieve complex1 as YAML from environment', done => {
      service.getStateOrEnvOrDefault('COMPLEX1', 'complex1' as any).subscribe(complex1 => {
        expect(complex1).toMatchInlineSnapshot(`
          Object {
            "Auth0": Object {
              "clientId": "clientId",
              "domain": "domain",
              "type": "Auth0",
            },
          }
        `);
        done();
      });
    });

    it('should retrieve complex2 as JSON from environment', done => {
      service.getStateOrEnvOrDefault('COMPLEX2', 'complex2' as any).subscribe(complex2 => {
        expect(complex2).toMatchInlineSnapshot(`
          Object {
            "fr_FR": "/fr",
          }
        `);
        done();
      });
    });

    it('should retrieve simple1 from environment', done => {
      service.getStateOrEnvOrDefault('SIMPLE1', 'simple1' as any).subscribe(simple1 => {
        expect(simple1).toMatchInlineSnapshot(`"Auth0"`);
        done();
      });
    });

    it('should retrieve simple2 from state because it was set', done => {
      service.getStateOrEnvOrDefault('SIMPLE2', 'simple2' as any).subscribe(simple2 => {
        expect(simple2).toMatchInlineSnapshot(`"de_DE"`);
        done();
      });
    });

    it('should retrieve simple3 from environment', done => {
      service.getStateOrEnvOrDefault('SIMPLE3', 'simple3' as any).subscribe(simple3 => {
        expect(simple3).toMatchInlineSnapshot(`"true"`);
        done();
      });
    });
  });
});
