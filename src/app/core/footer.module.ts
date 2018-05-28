import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  imports: [RouterModule, CollapseModule, ModalModule, PopoverModule],
  declarations: [FooterComponent],
  exports: [FooterComponent],
})
export class FooterModule {}
