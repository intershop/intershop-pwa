import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { CopilotEmbeddedStoreModule } from '../copilot-embedded-store.module';

import { copilotEmbeddedConfigInternalActions } from './copilot-embedded-config.actions';
import { CopilotEmbeddedConfigEffects } from './copilot-embedded-config.effects';

describe('Copilot Embedded Config Effects', () => {
  let actions$: Observable<Action>;
  let statePropertiesService: StatePropertiesService;
  let effects: CopilotEmbeddedConfigEffects;

  const config = {
    apiHost: 'https://api.example.com',
    chatflowid: 'xxxx-xxxx-xxxx-xxxx-xxxx',
  };

  beforeEach(() => {
    statePropertiesService = mock(StatePropertiesService);

    TestBed.configureTestingModule({
      imports: [CopilotEmbeddedStoreModule.forTesting('copilotEmbeddedConfig'), CoreStoreModule.forTesting()],
      providers: [
        { provide: StatePropertiesService, useFactory: () => instance(statePropertiesService) },
        CopilotEmbeddedConfigEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(CopilotEmbeddedConfigEffects);
  });

  describe('loadCopilotEmbeddedConfig$', () => {
    beforeEach(() => {
      when(statePropertiesService.getStateOrEnvOrDefault(anything(), anything())).thenReturn(of(config));
    });

    it('should call the StatePropertiesService for loadCopilotEmbeddedConfig', done => {
      actions$ = of(copilotEmbeddedConfigInternalActions.loadCopilotEmbeddedConfig());

      effects.loadCopilotEmbeddedConfig$.subscribe(() => {
        verify(statePropertiesService.getStateOrEnvOrDefault('COPILOT_EMBEDDED', 'copilotEmbedded')).once();
        done();
      });
    });

    it('should map to action of type setCopilotEmbeddedConfig', () => {
      const action = copilotEmbeddedConfigInternalActions.loadCopilotEmbeddedConfig();
      const completion = copilotEmbeddedConfigInternalActions.setCopilotEmbeddedConfig({ config });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadCopilotEmbeddedConfig$).toBeObservable(expected$);
    });
  });

  describe('loadCopilotEmbeddedConfigOnInit$', () => {
    it('should map to action of type loadCopilotEmbeddedConfig on init', done => {
      effects.loadCopilotEmbeddedConfigOnInit$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`[Copilot Embedded Config Internal] Load Copilot Embedded Config`);
        done();
      });
    });
  });
});
