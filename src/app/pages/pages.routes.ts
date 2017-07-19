import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
    { path: 'familyPage', loadChildren: 'app/pages/familyPage/familyPage.module#FamilyPageModule' },
    { path: 'register', loadChildren: 'app/pages/registrationPage/registrationPage.module#RegistrationPageModule' },
    { path: 'login', loadChildren: 'app/pages/accountLogin/accountLogin.module#AccountLoginModule' },
    { path: 'error', loadChildren: 'app/pages/errorPage/error-page.module#ErrorPageModule' },
    { path: 'wishlist', loadChildren: 'app/pages/wishlistPage/wishlistPage.module#WishlistPageModule' },
    { path: '**', redirectTo: 'familyPage' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }