import { TestBed } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';

import { Contact } from 'ish-core/models/contact/contact.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { contactReducers } from 'ish-core/store/contact/contact-store.module';
import { coreReducers } from 'ish-core/store/core-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import * as actions from './contact.actions';
import { getContactLoading, getContactSubjects } from './contact.selectors';

describe('Contact Selectors', () => {
  let store$: TestStore;

  const contact: Contact = {
    comment: 'Where is my order?',
    email: 'p.miller@test.intershop.de',
    name: 'Patricia Miller',
    phone: '12345',
    subject: 'Order Request',
  };

  const subjects = ['Return', 'Product Question'];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: ngrxTesting({
        reducers: {
          ...coreReducers,
          contact: combineReducers(contactReducers),
        },
      }),
    });

    store$ = TestBed.get(TestStore);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getContactLoading(store$.state)).toBeFalse();
    });

    it('should not select any subjects and errors when used', () => {
      expect(getContactSubjects(store$.state)).toBeEmpty();
      expect(getContactLoading(store$.state)).toBeFalse();
    });
  });

  describe('CreateContact', () => {
    const action = new actions.CreateContact({ contact });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set the state to loading', () => {
      expect(getContactLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new actions.CreateContactSuccess());
      });

      it('should set loading to false', () => {
        expect(getContactLoading(store$.state)).toBeFalse();
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new actions.CreateContactFail({ error: { message: 'error' } as HttpError }));
      });

      it('should not have loaded subjects on error', () => {
        expect(getContactLoading(store$.state)).toBeFalse();
      });
    });
  });
  describe('loading subjects', () => {
    beforeEach(() => {
      store$.dispatch(new actions.LoadContact());
    });

    it('should set the state to loading', () => {
      expect(getContactLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new actions.LoadContactSuccess({ subjects }));
      });

      it('should set loading to false', () => {
        expect(getContactLoading(store$.state)).toBeFalse();
        expect(getContactSubjects(store$.state)).toEqual(subjects);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new actions.LoadContactFail({ error: { message: 'error' } as HttpError }));
      });

      it('should not have loaded subjects on error', () => {
        expect(getContactLoading(store$.state)).toBeFalse();
        expect(getContactSubjects(store$.state)).toBeEmpty();
      });
    });
  });
});
