import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CompareDetailsComponent } from "app/shared/components/header/productCompare/compareDetails.component";

const routes: Routes = [
    { path: 'familyPage', loadChildren: 'app/pages/familyPage/familyPage.module#FamilyPageModule' },
    { path: 'familyPage/compare/:id', component: CompareDetailsComponent },
    { path: '', redirectTo: 'familyPage', pathMatch: 'full' },
    { path: 'register', loadChildren: 'app/pages/registrationPage/registrationPage.module#RegistrationPageModule' },
    { path: 'tile', loadChildren: 'app/pages/tilePage/tilePage.module#TilePageModule' },
    { path: 'login', loadChildren: 'app/pages/accountLogin/accountLogin.module#AccountLoginModule' },
    { path: 'error', loadChildren: 'app/pages/errorPage/error-page.module#ErrorPageModule' },
    { path: '**', redirectTo: 'familyPage' }

];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {

}
export const routingComponents = []
