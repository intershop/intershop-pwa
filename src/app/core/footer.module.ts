import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { FooterComponent } from './components/footer/footer.component';
import { IconModule } from './icon.module';

@NgModule({
  imports: [RouterModule, NgbCollapseModule, IconModule],
  declarations: [FooterComponent],
  exports: [FooterComponent, IconModule],
})
export class FooterModule {}
