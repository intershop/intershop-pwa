import { NgModule } from '@angular/core';
import { PagesRoutingModule } from './pages.routes';
import { AuthGuard } from 'app/services/auth-guard.service';

@NgModule({
  imports: [
    PagesRoutingModule
  ],
  declarations: [],
  providers: [AuthGuard]
})

export class PageModule {

}
