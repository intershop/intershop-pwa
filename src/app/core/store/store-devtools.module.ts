import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { setStickyHeader } from 'ish-core/store/core/viewconf';
import { loadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import { loadPromotion } from 'ish-core/store/shopping/promotions';
import { suggestSearch } from 'ish-core/store/shopping/search';

// remove the 'store-devtools.module.ts' fileReplacements in 'angular.json' to enable Store Devtools in production

export const storeDevtoolsModule = [
  StoreDevtoolsModule.instrument({
    maxAge: PRODUCTION_MODE ? 25 : 200,
    logOnly: PRODUCTION_MODE, // restrict extension to log-only mode
    actionsBlocklist: [loadPromotion.type, loadProductIfNotLoaded.type, setStickyHeader.type, suggestSearch.type],
  }),
];
