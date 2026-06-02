import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';

import { SeoEffects } from './seo/seo.effects';

const seoEffects = [SeoEffects];

export function provideSeoStore(): EnvironmentProviders {
  return makeEnvironmentProviders([provideEffects(seoEffects)]);
}

export class SeoStoreProviders {}
