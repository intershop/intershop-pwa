import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { setStickyHeader } from 'ish-core/store/core/viewconf';
import { loadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import { loadPromotion } from 'ish-core/store/shopping/promotions';
import { suggestSearch } from 'ish-core/store/shopping/search';

export const storeDevtoolsModule = [
  StoreDevtoolsModule.instrument({
    maxAge: 200,
    actionsBlocklist: [loadPromotion.type, loadProductIfNotLoaded.type, setStickyHeader.type, suggestSearch.type],
  }),
];
