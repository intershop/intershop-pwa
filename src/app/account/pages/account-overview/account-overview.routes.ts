import { Routes } from '@angular/router';
import { AccountOverviewComponent } from './account-overview.component';

export const accountOverviewRoutes: Routes = [
  { path: '', component: AccountOverviewComponent },
  { path: 'wishlist', loadChildren: 'app/account/pages/wishlists-page/wishlists-page.module#WishlistPageModule' }
];
