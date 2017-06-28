import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', loadChildren: './HomePage/home-page.module#HomePageModule'},
  {path: 'categories', loadChildren: './FamilyPage/family-page.module#FamilyPageModule' }, 
  {path: 'registration', loadChildren: './RegistrationPage/registration-page.module#RegistrationPageModule' },
  {path: 'error', loadChildren: './ErrorPage/error-page.module#ErrorPageModule' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
