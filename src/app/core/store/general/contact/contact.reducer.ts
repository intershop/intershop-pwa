import { createReducer, on } from '@ngrx/store';

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
  on(loadContact, state => ({
    ...state,
    loading: true,
    success: undefined,
  })),
  on(loadContactFail, state => ({
    ...state,
    loading: false,
    success: undefined,
  })),
  on(loadContactSuccess, (state, action) => {
    const { subjects } = action.payload;
    return {
      ...state,
      subjects,
      loading: false,
      success: undefined,
    };
  }),
  on(createContact, state => ({
    ...state,
    loading: true,
    success: undefined,
  })),
  on(createContactFail, state => ({
    ...state,
    loading: false,
    success: false,
  })),
  on(createContactSuccess, state => ({
    ...state,
    loading: false,
    success: true,
  }))
);
