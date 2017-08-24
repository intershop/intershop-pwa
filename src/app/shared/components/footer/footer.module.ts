import { NgModule } from '@angular/core';
import { FooterComponent } from './footer.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  imports: [
    CollapseModule
  ],
  exports: [
    FooterComponent
  ],
  declarations: [
    FooterComponent
  ],
  providers: []
})

export class FooterModule {

}
