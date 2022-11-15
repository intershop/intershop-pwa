import { createFeatureSelector } from '@ngrx/store';

import { CxmlConfigurationState } from './cxml-configuration/cxml-configuration.reducer';
import { OciConfigurationState } from './oci-configuration/oci-configuration.reducer';
import { PunchoutTypesState } from './punchout-types/punchout-types.reducer';
import { PunchoutUsersState } from './punchout-users/punchout-users.reducer';

export interface PunchoutState {
  ociConfiguration: OciConfigurationState;
  punchoutUsers: PunchoutUsersState;
  punchoutTypes: PunchoutTypesState;
  cxmlConfiguration: CxmlConfigurationState;
}

export const getPunchoutState = createFeatureSelector<PunchoutState>('punchout');
