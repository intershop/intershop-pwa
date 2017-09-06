import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../services/auth-guard.service'
import { LocalizeRouterModule } from '../services/routes-parser-locale-currency/localize-router.module';

const routes: Routes = [
  { path: 'category', loadChildren: 'app/pages/category-page/category-page.module#CategoryPageModule' },
  { path: 'family', loadChildren: 'app/pages/family-page/family-page.module#FamilyPageModule' },
  { path: 'compare', loadChildren: 'app/pages/compare-page/compare-page.module#ComparePageModule' },
  { path: 'login', loadChildren: 'app/pages/account-login/account-login.module#AccountLoginModule' },
  { path: 'register', loadChildren: 'app/pages/registration-page/registration-page.module#RegistrationPageModule' },
  { path: 'wishlist', loadChildren: 'app/pages/wishlists-page/wishlists-page.module#WishlistPageModule', canActivate: [AuthGuard] },
  { path: 'error', loadChildren: 'app/pages/error-page/error-page.module#ErrorPageModule', data: { className: 'errorpage' } },
  { path: '**', redirectTo: '/error' }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    LocalizeRouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
