import { NgModule } from '@angular/core';
import { InstanceService } from '../services/instance.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  exports: [TranslateModule],
    providers: [
        InstanceService
    ]
})
export class SharedModule { }
