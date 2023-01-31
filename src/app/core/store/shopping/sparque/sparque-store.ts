import { createFeatureSelector } from '@ngrx/store';
import { SparqueConfig } from 'ish-core/models/sparque/sparque-config.model';

export interface SparqueState {
  sparqueConfig: SparqueConfig;
}

export const getSparqueState = createFeatureSelector<SparqueState>('sparque');
