import { InjectionToken } from '@angular/core';
import { Response } from 'express';

export const RESPONSE = new InjectionToken<Response>('RESPONSE');
export const REQUEST_ID = new InjectionToken<string>('REQUEST_ID');
