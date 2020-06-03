import { TestBed } from '@angular/core/testing';

import { Contact } from 'ish-core/models/contact/contact.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { GeneralStoreModule } from 'ish-core/store/general/general-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import {
  CreateContact,
  CreateContactFail,
  CreateContactSuccess,
  LoadContact,
  LoadContactFail,
  LoadContactSuccess,
} from './contact.actions';
import { getContactLoading, getContactSubjects } from './contact.selectors';

describe('Contact Selectors', () => {
  let store$: StoreWithSnapshots;

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
      imports: [CoreStoreModule.forTesting(), GeneralStoreModule.forTesting('contact')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
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
    const action = new CreateContact({ contact });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set the state to loading', () => {
      expect(getContactLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new CreateContactSuccess());
      });

      it('should set loading to false', () => {
        expect(getContactLoading(store$.state)).toBeFalse();
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new CreateContactFail({ error: { message: 'error' } as HttpError }));
      });

      it('should not have loaded subjects on error', () => {
        expect(getContactLoading(store$.state)).toBeFalse();
      });
    });
  });
  describe('loading subjects', () => {
    beforeEach(() => {
      store$.dispatch(new LoadContact());
    });

    it('should set the state to loading', () => {
      expect(getContactLoading(store$.state)).toBeTrue();
    });

    describe('and reporting success', () => {
      beforeEach(() => {
        store$.dispatch(new LoadContactSuccess({ subjects }));
      });

      it('should set loading to false', () => {
        expect(getContactLoading(store$.state)).toBeFalse();
        expect(getContactSubjects(store$.state)).toEqual(subjects);
      });
    });

    describe('and reporting failure', () => {
      beforeEach(() => {
        store$.dispatch(new LoadContactFail({ error: { message: 'error' } as HttpError }));
      });

      it('should not have loaded subjects on error', () => {
        expect(getContactLoading(store$.state)).toBeFalse();
        expect(getContactSubjects(store$.state)).toBeEmpty();
      });
    });
  });
});
