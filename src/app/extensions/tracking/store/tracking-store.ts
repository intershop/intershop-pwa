import { createFeatureSelector } from '@ngrx/store';

export interface TrackingState {
  gtmToken: string;
}

export const getTrackingState = createFeatureSelector<TrackingState>('tracking');
