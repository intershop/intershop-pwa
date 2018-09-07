import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { FooterComponent } from './components/footer/footer.component';
import { IconModule } from './icon.module';

@NgModule({
  imports: [RouterModule, NgbCollapseModule, IconModule, TranslateModule.forRoot()],
  declarations: [FooterComponent],
  exports: [FooterComponent, IconModule],
})
export class FooterModule {}
