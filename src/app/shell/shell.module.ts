import { NgModule } from '@angular/core';
import { FooterModule } from './components/footer/footer.module';
import { HeaderModule } from './components/header/header.module';
import { ShellRoutingModule } from './shell-routing.module';

@NgModule({
  imports: [
    ShellRoutingModule,
    HeaderModule,
    FooterModule
  ],
  exports: [
    HeaderModule,
    FooterModule
  ]
})

export class ShellModule { }
