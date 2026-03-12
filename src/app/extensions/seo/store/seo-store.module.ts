import { EnvironmentProviders, importProvidersFrom, makeEnvironmentProviders } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { SeoEffects } from './seo/seo.effects';

const seoEffects = [SeoEffects];

const seoStoreImports = [EffectsModule.forFeature(seoEffects)];

export function provideSeoStore(): EnvironmentProviders {
  return makeEnvironmentProviders([importProvidersFrom(...seoStoreImports)]);
}

export class SeoStoreModule {}
