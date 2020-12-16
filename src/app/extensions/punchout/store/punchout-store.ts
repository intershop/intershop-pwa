import { createFeatureSelector } from '@ngrx/store';

import { OciPunchoutState } from './oci-punchout/oci-punchout.reducer';

export interface PunchoutState {
  ociPunchout: OciPunchoutState;
}

export const getPunchoutState = createFeatureSelector<PunchoutState>('punchout');
