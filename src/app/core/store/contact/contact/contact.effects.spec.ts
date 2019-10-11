import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, combineReducers } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { Contact } from 'ish-core/models/contact/contact.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ContactService } from 'ish-core/services/contact/contact.service';
import { contactReducers } from 'ish-core/store/contact/contact-store.module';
import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import * as actions from './contact.actions';
import { ContactEffects } from './contact.effects';

describe('Contact Effects', () => {
  let actions$: Observable<Action>;
  let effects: ContactEffects;
  let contactServiceMock: ContactService;

  const contact: Contact = {
    comment: 'Where is my order?',
    email: 'p.miller@test.intershop.de',
    name: 'Patricia Miller',
    phone: '12345',
    subject: 'Order Request',
  };

  const subjects = ['Return', 'Product Question'];

  beforeEach(() => {
    contactServiceMock = mock(ContactService);
    TestBed.configureTestingModule({
      imports: [
        ngrxTesting({
          reducers: {
            ...coreReducers,
            contact: combineReducers(contactReducers),
          },
        }),
      ],
      providers: [
        ContactEffects,
        provideMockActions(() => actions$),
        { provide: ContactService, useFactory: () => instance(contactServiceMock) },
      ],
    });

    effects = TestBed.get(ContactEffects);
  });

  describe('loadSubjects$', () => {
    it('should load all subjects on effects init and dispatch a LoadContactSuccess action', () => {
      when(contactServiceMock.getContactSubjects()).thenReturn(of(subjects));
      const action = { type: actions.ContactActionTypes.LoadContact } as Action;
      const expected = new actions.LoadContactSuccess({ subjects });

      actions$ = hot('-a-------', { a: action });

      expect(effects.loadSubjects$).toBeObservable(cold('-b-------', { b: expected }));
    });

    it('should dispatch a LoadContactFail action if a load error occurs', () => {
      when(contactServiceMock.getContactSubjects()).thenReturn(throwError({ message: 'error' }));

      const action = { type: actions.ContactActionTypes.LoadContact } as Action;
      const expected = new actions.LoadContactFail({ error: { message: 'error' } as HttpError });

      actions$ = hot('-a', { a: action });

      expect(effects.loadSubjects$).toBeObservable(cold('-b', { b: expected }));
    });
  });

  describe('createContactRequest$', () => {
    it('should not dispatch actions when encountering LoadContactData', () => {
      when(contactServiceMock.createContactRequest(contact)).thenReturn(of());
      const action = new actions.CreateContact({ contact });
      hot('-a-a-a', { a: action });
      const expected$ = cold('');

      expect(effects.createContact$).toBeObservable(expected$);
    });
  });
});
