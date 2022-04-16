import { createFeatureSelector } from '@ngrx/store';

export interface ContactUsState {}

export const getContactUsState = createFeatureSelector<ContactUsState>('contactUs');
