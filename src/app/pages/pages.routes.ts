import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadChildren: 'app/pages/home-page/home-page.module#HomePageModule' },
  { path: 'category', loadChildren: 'app/pages/familyPage/familyPage.module#FamilyPageModule' },
  { path: 'compare', loadChildren: 'app/pages/compare-page/compare-page.module#ComparePageModule' },
  { path: 'login', loadChildren: 'app/pages/accountLogin/accountLogin.module#AccountLoginModule' },
  { path: 'register', loadChildren: 'app/pages/registrationPage/registrationPage.module#RegistrationPageModule' },
  { path: 'wishlist', loadChildren: 'app/pages/wishlistPage/wishlistPage.module#WishlistPageModule' },
  { path: 'error', loadChildren: 'app/pages/error-page/error-page.module#ErrorPageModule' },
  { path: '**', redirectTo: 'error' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
