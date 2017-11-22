import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: 'app/shell/pages/home-page/home-page.module#HomePageModule' },
  { path: 'error', loadChildren: 'app/shell/pages/error-page/error-page.module#ErrorPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class ShellRoutingModule { }
