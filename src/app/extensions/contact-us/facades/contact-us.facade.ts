import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Contact } from 'ish-core/models/contact/contact.model';

import { createContact, getContactLoading, getContactSubjects, getContactSuccess, loadContact } from '../store/contact';

/* eslint-disable @typescript-eslint/member-ordering */
@Injectable({ providedIn: 'root' })
export class ContactUsFacade {
  constructor(private store: Store) {}

  contactSubjects$() {
    this.store.dispatch(loadContact());
    return this.store.pipe(select(getContactSubjects));
  }
  contactLoading$ = this.store.pipe(select(getContactLoading));
  contactSuccess$ = this.store.pipe(select(getContactSuccess));

  resetContactState() {
    this.store.dispatch(loadContact());
  }
  createContact(contact: Contact) {
    this.store.dispatch(createContact({ contact }));
  }
}
