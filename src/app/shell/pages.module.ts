import { NgModule } from '@angular/core';
import { AuthGuard } from '../core/guards/auth.guard';
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
