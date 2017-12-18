import { Routes } from '@angular/router';
import { AccountPageComponent } from './account-page.component';

export const accountPageRoutes: Routes = [
  { path: '', component: AccountPageComponent },
  { path: 'wishlist', loadChildren: 'app/account/pages/wishlists-page/wishlists-page.module#WishlistsPageModule' }
];
