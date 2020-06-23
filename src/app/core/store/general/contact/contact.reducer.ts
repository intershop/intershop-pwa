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
  on(loadContact, (state: ContactState) => ({
    ...state,
    loading: true,
    success: undefined,
  })),
  on(loadContactFail, (state: ContactState) => ({
    ...state,
    loading: false,
    success: undefined,
  })),
  on(loadContactSuccess, (state: ContactState, action) => {
    const { subjects } = action.payload;
    return {
      ...state,
      subjects,
      loading: false,
      success: undefined,
    };
  }),
  on(createContact, (state: ContactState) => ({
    ...state,
    loading: true,
    success: undefined,
  })),
  on(createContactFail, (state: ContactState) => ({
    ...state,
    loading: false,
    success: false,
  })),
  on(createContactSuccess, (state: ContactState) => ({
    ...state,
    loading: false,
    success: true,
  }))
);
