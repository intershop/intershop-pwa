import { createFeatureSelector } from '@ngrx/store';

import { CountriesState } from './countries/countries.reducer';
import { RegionsState } from './regions/regions.reducer';
import { WishlistState } from './wishlist/wishlist.reducer';

export interface GeneralState {
  countries: CountriesState;
  regions: RegionsState;
  wishlist: WishlistState;
}

export const getGeneralState = createFeatureSelector<GeneralState>('general');
