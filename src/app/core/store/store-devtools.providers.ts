import { EnvironmentProviders } from '@angular/core';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { setStickyHeader } from 'ish-core/store/core/viewconf';
import { loadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import { loadPromotion } from 'ish-core/store/shopping/promotions';
import { suggestSearch } from 'ish-core/store/shopping/search';

// remove the 'store-devtools.providers.ts' fileReplacements in 'angular.json' to enable Store Devtools in production

export function providePwaStoreDevtools(): EnvironmentProviders {
  return provideStoreDevtools({
    maxAge: PRODUCTION_MODE ? 25 : 200,
    logOnly: PRODUCTION_MODE, // restrict extension to log-only mode
    actionsBlocklist: [loadPromotion.type, loadProductIfNotLoaded.type, setStickyHeader.type, suggestSearch.type],
    connectInZone: true,
  });
}
