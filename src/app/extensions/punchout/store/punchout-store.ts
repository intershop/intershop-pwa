import { createFeatureSelector } from '@ngrx/store';

import { PunchoutTypesState } from './punchout-types/punchout-types.reducer';
import { PunchoutUsersState } from './punchout-users/punchout-users.reducer';

export interface PunchoutState {
  punchoutUsers: PunchoutUsersState;
  punchoutTypes: PunchoutTypesState;
}

export const getPunchoutState = createFeatureSelector<PunchoutState>('punchout');
