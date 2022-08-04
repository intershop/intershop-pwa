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

export const initialState: ContactState = {
  subjects: [],
  loading: false,
  success: undefined,
};

export const contactReducer = createReducer(
  initialState,
  setLoadingOn(loadContact, createContact),
  unsetLoadingOn(loadContactFail, loadContactSuccess, createContactFail, createContactSuccess),
  on(
    loadContact,
    (state): ContactState => ({
      ...state,
      success: undefined,
    })
  ),
  on(
    loadContactFail,
    (state): ContactState => ({
      ...state,
      success: undefined,
    })
  ),
  on(loadContactSuccess, (state, action): ContactState => {
    const { subjects } = action.payload;
    return {
      ...state,
      subjects,
      success: undefined,
    };
  }),
  on(
    createContact,
    (state): ContactState => ({
      ...state,
      success: undefined,
    })
  ),
  on(
    createContactFail,
    (state): ContactState => ({
      ...state,
      success: false,
    })
  ),
  on(
    createContactSuccess,
    (state): ContactState => ({
      ...state,
      success: true,
    })
  )
);
