import { InjectionToken } from '@angular/core';
import { Request, Response } from 'express';

export const REQUEST = new InjectionToken<Request>('REQUEST');
export const RESPONSE = new InjectionToken<Response>('RESPONSE');
export const REQUEST_ID = new InjectionToken<string>('REQUEST_ID');
