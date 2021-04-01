import { createReducer, on } from '@ngrx/store';

import { setLoadingOn, unsetLoadingOn } from 'ish-core/utils/ngrx-creators';

import {
  createContact,
  createContactFail,
  createContactSuccess,
  loadContact,
  loadContactFail,
  loadContactSuccess,
} from './contact.actions';

export interface ContactState {
  subjects: string[];
  loading: boolean;
  success: boolean;
}

const initialState: ContactState = {
  subjects: [],
  loading: false,
  success: undefined,
};

export const contactReducer = createReducer(
  initialState,
  setLoadingOn(loadContact, createContact),
  unsetLoadingOn(loadContactFail, loadContactSuccess, createContactFail, createContactSuccess),
  on(loadContact, state => ({
    ...state,
    success: undefined,
  })),
  on(loadContactFail, state => ({
    ...state,
    success: undefined,
  })),
  on(loadContactSuccess, (state, action) => {
    const { subjects } = action.payload;
    return {
      ...state,
      subjects,
      success: undefined,
    };
  }),
  on(createContact, state => ({
    ...state,
    success: undefined,
  })),
  on(createContactFail, state => ({
    ...state,
    success: false,
  })),
  on(createContactSuccess, state => ({
    ...state,
    success: true,
  }))
);
