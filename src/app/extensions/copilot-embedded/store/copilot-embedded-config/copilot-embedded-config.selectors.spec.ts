import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { CopilotEmbeddedStoreModule } from '../copilot-embedded-store.module';

import { copilotEmbeddedConfigInternalActions } from './copilot-embedded-config.actions';
import { getCopilotEmbeddedConfig } from './copilot-embedded-config.selectors';

describe('Copilot Embedded Config Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CopilotEmbeddedStoreModule.forTesting('copilotEmbeddedConfig'), CoreStoreModule.forTesting()],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should be empty when in initial state', () => {
      expect(getCopilotEmbeddedConfig(store$.state)).toBeUndefined();
    });
  });

  describe('after loading', () => {
    beforeEach(() => {
      store$.dispatch(
        copilotEmbeddedConfigInternalActions.setCopilotEmbeddedConfig({
          config: { apiHost: 'https://api.example.com', chatflowid: 'xxxx-xxxx-xxxx-xxxx-xxxx' },
        })
      );
    });

    it('should set store value to the given config', () => {
      expect(getCopilotEmbeddedConfig(store$.state)).toMatchInlineSnapshot(`
        {
          "apiHost": "https://api.example.com",
          "chatflowid": "xxxx-xxxx-xxxx-xxxx-xxxx",
        }
      `);
    });
  });
});
