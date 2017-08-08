import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
    { path: 'familyPage', loadChildren: 'app/pages/family-page/family-page.module#FamilyPageModule' },
    { path: 'register', loadChildren: 'app/pages/registration-page/registration-page.module#RegistrationPageModule' },
    { path: 'login', loadChildren: 'app/pages/account-login/account-login.module#AccountLoginModule' },
    { path: 'error', loadChildren: 'app/pages/error-page/error-page.module#ErrorPageModule' },
    { path: 'wishlist', loadChildren: 'app/pages/wish-list-page/wish-list-page.module#WishlistPageModule' },
    { path: '**', redirectTo: 'familyPage' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
