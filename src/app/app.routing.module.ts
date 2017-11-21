import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageModule } from './shopping/pages/home-page/home-page.module';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    HomePageModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {

}

