import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer.component';
import { footerRoutes } from './footer.routes';

@NgModule({
  imports: [
    CommonModule,
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
