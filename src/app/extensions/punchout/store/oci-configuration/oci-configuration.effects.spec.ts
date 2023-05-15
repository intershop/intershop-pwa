import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { PunchoutService } from '../../services/punchout/punchout.service';

import { ociConfigurationActions, ociConfigurationApiActions } from './oci-configuration.actions';
import { OciConfigurationEffects } from './oci-configuration.effects';

describe('Oci Configuration Effects', () => {
  let actions$: Observable<Action>;
  let effects: OciConfigurationEffects;
  let punchoutService: PunchoutService;

  beforeEach(() => {
    punchoutService = mock(PunchoutService);
    when(punchoutService.getOciConfigurationOptions()).thenReturn(of(undefined));
    when(punchoutService.getOciConfiguration()).thenReturn(of(undefined));
    when(punchoutService.updateOciConfiguration(anything())).thenReturn(of(undefined));

    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting([])],
      providers: [
        { provide: PunchoutService, useFactory: () => instance(punchoutService) },
        OciConfigurationEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(OciConfigurationEffects);
  });

  describe('loadOciOptionsAndConfiguration$', () => {
    it('should map to actions of type loadOciConfigurationOptions and loadOciConfiguration', () => {
      const action = ociConfigurationActions.loadOciOptionsAndConfiguration();

      const completion1 = ociConfigurationActions.loadOciConfigurationOptions();
      const completion2 = ociConfigurationActions.loadOciConfiguration();

      actions$ = hot('-a----a----a----', { a: action });
      const expected$ = cold('-(bc)-(bc)-(bc)', { b: completion1, c: completion2 });

      expect(effects.loadOciOptionsAndConfiguration$).toBeObservable(expected$);
    });
  });

  describe('loadOciConfigurationOptions$', () => {
    it('should call the punchoutService for getOciConfigurationOptions', done => {
      const action = ociConfigurationActions.loadOciConfigurationOptions;
      actions$ = of(action);

      effects.loadOciConfigurationOptions$.subscribe(() => {
        verify(punchoutService.getOciConfigurationOptions()).once();
        done();
      });
    });

    it('should map to action of type loadOciConfigurationOptionsSuccess', () => {
      const action = ociConfigurationActions.loadOciConfigurationOptions;

      const completion = ociConfigurationApiActions.loadOciConfigurationOptionsSuccess({ options: undefined });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-b-b-b)', { b: completion });

      expect(effects.loadOciConfigurationOptions$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type loadOciConfigurationOptionsFail', () => {
      when(punchoutService.getOciConfigurationOptions()).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );

      const action = ociConfigurationActions.loadOciConfigurationOptions;
      const error = makeHttpError({ message: 'invalid' });
      const completion = ociConfigurationApiActions.loadOciConfigurationOptionsFail({ error });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOciConfigurationOptions$).toBeObservable(expected$);
    });
  });

  describe('loadOciConfiguration$', () => {
    it('should call the punchoutService for getOciConfiguration', done => {
      const action = ociConfigurationActions.loadOciConfiguration;
      actions$ = of(action);

      effects.loadOciConfiguration$.subscribe(() => {
        verify(punchoutService.getOciConfiguration()).once();
        done();
      });
    });

    it('should map to action of type loadOciConfigurationSuccess', () => {
      const action = ociConfigurationActions.loadOciConfiguration;

      const completion = ociConfigurationApiActions.loadOciConfigurationSuccess({ configuration: undefined });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-b-b-b)', { b: completion });

      expect(effects.loadOciConfiguration$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type loadOciConfigurationFail', () => {
      when(punchoutService.getOciConfiguration()).thenReturn(throwError(() => makeHttpError({ message: 'invalid' })));

      const action = ociConfigurationActions.loadOciConfiguration;
      const error = makeHttpError({ message: 'invalid' });
      const completion = ociConfigurationApiActions.loadOciConfigurationFail({ error });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadOciConfiguration$).toBeObservable(expected$);
    });
  });

  describe('updateOciConfiguration$', () => {
    it('should call the punchoutService for updateOciConfiguration', done => {
      const action = ociConfigurationActions.updateOciConfiguration({ configuration: [] });
      actions$ = of(action);

      effects.updateOciConfiguration$.subscribe(() => {
        verify(punchoutService.updateOciConfiguration(anything())).once();
        done();
      });
    });

    it('should map to actions of type updateOciConfigurationSuccess and displaySuccessMessage', () => {
      const action = ociConfigurationActions.updateOciConfiguration({ configuration: [] });

      const completion1 = ociConfigurationApiActions.updateOciConfigurationSuccess({ configuration: undefined });
      const completion2 = displaySuccessMessage({ message: 'account.punchout.configuration.save_success.message' });

      actions$ = hot('-a----a----a----', { a: action });
      const expected$ = cold('-(bc)-(bc)-(bc)', { b: completion1, c: completion2 });

      expect(effects.updateOciConfiguration$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type updateOciConfigurationFail', () => {
      when(punchoutService.updateOciConfiguration(anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );

      const action = ociConfigurationActions.updateOciConfiguration({ configuration: [] });
      const error = makeHttpError({ message: 'invalid' });
      const completion = ociConfigurationApiActions.updateOciConfigurationFail({ error });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateOciConfiguration$).toBeObservable(expected$);
    });
  });
});
