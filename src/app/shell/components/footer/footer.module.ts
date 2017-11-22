import { NgModule } from '@angular/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { SharedModule } from '../../../shared/shared.module';
import { FooterComponent } from './footer.component';

@NgModule({
  imports: [
    SharedModule,
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
