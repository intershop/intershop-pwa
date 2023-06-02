import { createFeatureSelector } from '@ngrx/store';

import { OciConfigurationState } from './oci-configuration/oci-configuration.reducer';
import { PunchoutTypesState } from './punchout-types/punchout-types.reducer';
import { PunchoutUsersState } from './punchout-users/punchout-users.reducer';

export interface PunchoutState {
  ociConfiguration: OciConfigurationState;
  punchoutUsers: PunchoutUsersState;
  punchoutTypes: PunchoutTypesState;
}

export const getPunchoutState = createFeatureSelector<PunchoutState>('punchout');
