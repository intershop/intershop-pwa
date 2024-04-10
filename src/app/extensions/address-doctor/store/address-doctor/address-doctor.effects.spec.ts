import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { AddressDoctorStoreModule } from '../address-doctor-store.module';

import { addressDoctorInternalActions } from './address-doctor.actions';
import { AddressDoctorEffects } from './address-doctor.effects';

describe('Address Doctor Effects', () => {
  let actions$: Observable<Action>;
  let statePropertiesService: StatePropertiesService;
  let effects: AddressDoctorEffects;

  const config = {
    login: 'login',
    password: 'password',
    maxResultCount: 5,
    url: 'http://address-doctor.com',
  };

  beforeEach(() => {
    statePropertiesService = mock(StatePropertiesService);

    TestBed.configureTestingModule({
      imports: [AddressDoctorStoreModule.forTesting('addressDoctorConfig'), CoreStoreModule.forTesting()],
      providers: [
        { provide: StatePropertiesService, useFactory: () => instance(statePropertiesService) },
        AddressDoctorEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(AddressDoctorEffects);
  });

  describe('loadAddressDoctorConfiguration$', () => {
    beforeEach(() => {
      when(statePropertiesService.getStateOrEnvOrDefault(anything(), anything())).thenReturn(of(config));
    });

    it('should call the StatePropertiesService for loadAddressDoctorConfiguration', done => {
      const action = addressDoctorInternalActions.loadAddressDoctorConfig();
      actions$ = of(action);

      effects.loadAddressDoctorConfiguration$.subscribe(() => {
        verify(statePropertiesService.getStateOrEnvOrDefault(anything(), anything())).once();
        done();
      });
    });

    it('should map to action of type setAddressDoctorConfiguration', () => {
      const action = addressDoctorInternalActions.loadAddressDoctorConfig();
      const completion = addressDoctorInternalActions.setAddressDoctorConfig({
        config,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadAddressDoctorConfiguration$).toBeObservable(expected$);
    });
  });

  describe('loadAddressDoctorConfigOnInit$', () => {
    it('should map to action of type loadAddressDoctorConfiguration on init', done => {
      effects.loadAddressDoctorConfigOnInit$.subscribe(actions => {
        expect(actions).toMatchInlineSnapshot(`[Address Doctor Internal] Load Address Doctor Config`);
        done();
      });
    });
  });
});
