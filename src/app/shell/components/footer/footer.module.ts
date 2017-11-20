import { NgModule } from '@angular/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FooterComponent } from './footer.component';

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
