import { createFeatureSelector } from '@ngrx/store';

import { PunchoutUsersState } from './punchout-users/punchout-users.reducer';

export interface PunchoutState {
  punchoutUsers: PunchoutUsersState;
}

export const getPunchoutState = createFeatureSelector<PunchoutState>('punchout');
