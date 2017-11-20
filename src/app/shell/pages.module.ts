import { NgModule } from '@angular/core';
import { AuthGuard } from '../services/auth-guard.service';
import { PagesRoutingModule } from './pages.routes';

@NgModule({
  imports: [
    PagesRoutingModule
  ],
  declarations: [],
  providers: [AuthGuard]
})

export class PageModule {
}
