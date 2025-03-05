import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { CopilotStoreModule } from '../copilot-store.module';

import { copilotConfigInternalActions } from './copilot-config.actions';
import { getCopilotConfig } from './copilot-config.selectors';

describe('Copilot Config Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CopilotStoreModule.forTesting('copilotConfig'), CoreStoreModule.forTesting()],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should be empty when in initial state', () => {
      expect(getCopilotConfig(store$.state)).toBeUndefined();
    });
  });

  describe('after loading', () => {
    const action = copilotConfigInternalActions.setCopilotConfig({
      config: {
        apiHost: 'https://api.example.com',
        chatflowid: 'xxxx-xxxx-xxxx-xxxx-xxxx',
        copilotUIFile: 'https://ui.example.com/web.js',
      },
    });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set store value to the given config', () => {
      expect(getCopilotConfig(store$.state)).toMatchInlineSnapshot(`
        {
          "apiHost": "https://api.example.com",
          "chatflowid": "xxxx-xxxx-xxxx-xxxx-xxxx",
          "copilotUIFile": "https://ui.example.com/web.js",
        }
      `);
    });
  });
});
