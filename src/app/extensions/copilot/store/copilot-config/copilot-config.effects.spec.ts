import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { CopilotStoreModule } from '../copilot-store.module';

import { copilotConfigInternalActions } from './copilot-config.actions';
import { CopilotConfigEffects } from './copilot-config.effects';

describe('Copilot Config Effects', () => {
  let actions$: Observable<Action>;
  let statePropertiesService: StatePropertiesService;
  let effects: CopilotConfigEffects;

  const config = {
    apiHost: 'https://api.example.com',
    chatflowid: 'xxxx-xxxx-xxxx-xxxx-xxxx',
    copilotUIFile: 'https://ui.example.com/web.js',
  };

  beforeEach(() => {
    statePropertiesService = mock(StatePropertiesService);

    TestBed.configureTestingModule({
      imports: [CopilotStoreModule.forTesting('copilotConfig'), CoreStoreModule.forTesting()],
      providers: [
        { provide: StatePropertiesService, useFactory: () => instance(statePropertiesService) },
        CopilotConfigEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(CopilotConfigEffects);
  });

  describe('loadCopilotConfiguration$', () => {
    beforeEach(() => {
      when(statePropertiesService.getStateOrEnvOrDefault(anything(), anything())).thenReturn(of(config));
    });

    it('should call the StatePropertiesService for loadCopilotConfiguration', done => {
      const action = copilotConfigInternalActions.loadCopilotConfig();
      actions$ = of(action);

      effects.loadCopilotConfiguration$.subscribe(() => {
        verify(statePropertiesService.getStateOrEnvOrDefault(anything(), anything())).once();
        done();
      });
    });

    it('should map to action of type setCopilotConfiguration', () => {
      const action = copilotConfigInternalActions.loadCopilotConfig();
      const completion = copilotConfigInternalActions.setCopilotConfig({
        config,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadCopilotConfiguration$).toBeObservable(expected$);
    });
  });

  describe('loadCopilotConfigOnInit$', () => {
    it('should map to action of type loadCopilotConfiguration on init', done => {
      effects.loadCopilotConfigOnInit$.subscribe(actions => {
        expect(actions).toMatchInlineSnapshot(`[Copilot Config Internal] Load Copilot Config`);
        done();
      });
    });
  });
});
