import { createFeatureSelector } from '@ngrx/store';

export interface CompareState {}

export const getCompareState = createFeatureSelector<CompareState>('compare');
