import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer.component';
import { footerRoutes } from './footer.routes';

@NgModule({
  imports: [
    RouterModule.forChild(footerRoutes),
  ],
  exports: [
    FooterComponent
  ],
  declarations: [FooterComponent],
  providers: []
})

export class FooterModule {

}
