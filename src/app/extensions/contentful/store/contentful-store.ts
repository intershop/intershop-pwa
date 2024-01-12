import { createFeatureSelector } from '@ngrx/store';

export interface ContentfulState {}

export const getContentfulState = createFeatureSelector<ContentfulState>('contentful');
