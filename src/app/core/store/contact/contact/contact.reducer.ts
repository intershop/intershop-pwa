import { ContactAction, ContactActionTypes } from './contact.actions';

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

export function contactReducer(state = initialState, action: ContactAction): ContactState {
  switch (action.type) {
    case ContactActionTypes.LoadContact: {
      return {
        ...state,
        loading: true,
        success: undefined,
      };
    }
    case ContactActionTypes.LoadContactFail: {
      return {
        ...state,
        loading: false,
        success: undefined,
      };
    }
    case ContactActionTypes.LoadContactSuccess: {
      const { subjects } = action.payload;
      return {
        ...state,
        subjects,
        loading: false,
        success: undefined,
      };
    }
    case ContactActionTypes.CreateContact: {
      return {
        ...state,
        loading: true,
        success: undefined,
      };
    }
    case ContactActionTypes.CreateContactFail: {
      return {
        ...state,
        loading: false,
        success: false,
      };
    }
    case ContactActionTypes.CreateContactSuccess: {
      return {
        ...state,
        loading: false,
        success: true,
      };
    }
  }

  return state;
}
