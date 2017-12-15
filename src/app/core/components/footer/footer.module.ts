import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CollapseModule } from 'ngx-bootstrap/collapse/collapse.module';
import { FooterComponent } from './footer.component';

@NgModule({
  imports: [
    RouterModule,
    CollapseModule
  ],
  declarations: [
    FooterComponent
  ],
  exports: [
    FooterComponent
  ]
})

export class FooterModule { }
