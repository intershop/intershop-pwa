import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FooterComponent } from './footer.component';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [
    FooterComponent
  ],
  declarations: [
    FooterComponent
  ]
})

export class FooterModule { }
