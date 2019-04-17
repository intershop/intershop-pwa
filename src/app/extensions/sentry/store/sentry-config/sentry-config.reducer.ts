import { SentryConfigAction, SentryConfigActionTypes } from './sentry-config.actions';

export interface SentryConfigState {
  dsn: string;
}

export const initialState: SentryConfigState = {
  dsn: undefined,
};

export function sentryConfigReducer(state = initialState, action: SentryConfigAction): SentryConfigState {
  switch (action.type) {
    case SentryConfigActionTypes.SetSentryConfig: {
      return {
        ...state,
        ...action.payload,
      };
    }
  }

  return state;
}
