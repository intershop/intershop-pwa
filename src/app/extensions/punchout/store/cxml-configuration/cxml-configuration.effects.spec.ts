import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';
import { PunchoutService } from '../../services/punchout/punchout.service';
import { getSelectedPunchoutUser } from '../punchout-users';

import { cxmlConfigurationActions, cxmlConfigurationApiActions } from './cxml-configuration.actions';
import { CxmlConfigurationEffects } from './cxml-configuration.effects';

describe('Cxml Configuration Effects', () => {
  let actions$: Observable<Action>;
  let effects: CxmlConfigurationEffects;
  let punchoutService: PunchoutService;

  beforeEach(() => {
    punchoutService = mock(PunchoutService);
    when(punchoutService.getCxmlConfiguration(anything())).thenReturn(of(undefined));
    when(punchoutService.updateCxmlConfiguration(anything(), anything())).thenReturn(of(undefined));

    TestBed.configureTestingModule({
      providers: [
        { provide: PunchoutService, useFactory: () => instance(punchoutService) },
        CxmlConfigurationEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          selectors: [
            {
              selector: getSelectedPunchoutUser,
              value: {
                active: true,
                email: 'cxmluser@test.intershop.de',
                id: 'cxmluser@test.intershop.de',
                login: 'cxmluser@test.intershop.de',
                punchoutType: 'cxml',
                type: 'PunchoutUser',
              } as PunchoutUser,
            },
          ],
        }),
      ],
    });

    effects = TestBed.inject(CxmlConfigurationEffects);
  });

  describe('loadCxmlConfiguration$', () => {
    it('should call the punchoutService for getCxmlConfiguration', done => {
      const action = cxmlConfigurationActions.loadCXMLConfiguration;
      actions$ = of(action);

      effects.loadCxmlConfiguration$.subscribe(() => {
        verify(punchoutService.getCxmlConfiguration(anything())).once();
        done();
      });
    });

    it('should map to action of type loadcxmlConfigurationSuccess', () => {
      const action = cxmlConfigurationActions.loadCXMLConfiguration;

      const completion = cxmlConfigurationApiActions.loadCXMLConfigurationSuccess({ configuration: undefined });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-b-b-b)', { b: completion });

      expect(effects.loadCxmlConfiguration$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type loadCxmlConfigurationFail', () => {
      when(punchoutService.getCxmlConfiguration('')).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
    });
  });

  describe('updateCxmlConfiguration$', () => {
    it('should call the punchoutService for updateCxmlConfiguration', done => {
      const action = cxmlConfigurationActions.updateCXMLConfiguration({ configuration: undefined });
      actions$ = of(action);

      effects.updateCxmlConfiguration$.subscribe(() => {
        verify(punchoutService.updateCxmlConfiguration(anything(), anything())).once();
        done();
      });
    });

    it('should map to actions of type updateCxmlConfigurationSuccess and displaySuccessMessage', () => {
      const action = cxmlConfigurationActions.updateCXMLConfiguration({ configuration: [] });

      const completion1 = cxmlConfigurationApiActions.updateCXMLConfigurationSuccess({ configuration: undefined });
      const completion2 = displaySuccessMessage({
        message: 'account.punchout.cxml.configuration.save_success.message',
      });

      actions$ = hot('-a----a----a----', { a: action });
      const expected$ = cold('-(bc)-(bc)-(bc)', { b: completion1, c: completion2 });

      expect(effects.updateCxmlConfiguration$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type updateCxmlConfigurationFail', () => {
      when(punchoutService.updateCxmlConfiguration(anything(), anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );

      const action = cxmlConfigurationActions.updateCXMLConfiguration({ configuration: [] });
      const error = makeHttpError({ message: 'invalid' });
      const completion = cxmlConfigurationApiActions.updateCXMLConfigurationFail({ error });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateCxmlConfiguration$).toBeObservable(expected$);
    });
  });
});
