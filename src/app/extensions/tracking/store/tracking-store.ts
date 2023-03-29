import { createFeatureSelector } from '@ngrx/store';

export interface TrackingState {
  gtmToken: string;
}

export interface MatomoState {
  trackerUrl: string;
  siteId: string;
}

export const getTrackingState = createFeatureSelector<TrackingState>('tracking');
