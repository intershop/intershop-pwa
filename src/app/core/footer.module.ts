import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { FooterComponent } from './components/footer/footer.component';
import { IconModule } from './icon.module';

@NgModule({
  imports: [IconModule, NgbCollapseModule, RouterModule, TranslateModule],
  declarations: [FooterComponent],
  exports: [FooterComponent],
})
export class FooterModule {}
