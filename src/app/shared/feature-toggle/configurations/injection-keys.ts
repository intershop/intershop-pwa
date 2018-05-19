import { InjectionToken } from '@angular/core';

export const FEATURE_TOGGLES = new InjectionToken<{ [feature: string]: boolean }>('featureToggles');
