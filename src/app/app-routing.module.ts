import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', redirectTo: '/home', pathMatch: 'full' }];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always', scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
