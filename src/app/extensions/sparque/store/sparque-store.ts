import { createFeatureSelector } from '@ngrx/store';

import { SparqueConfig } from '../models/sparque-config/sparque-config.model';

export interface SparqueState {
  sparqueConfig: SparqueConfig;
}
export const getSparqueState = createFeatureSelector<SparqueState>('sparque');
