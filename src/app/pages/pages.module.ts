import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {pageRoute} from './pages.routes'
import {RouterModule} from '@angular/router'
import {InstanceService} from '../shared/services/instance.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(pageRoute),
  ],
  declarations: [],
  providers: [InstanceService]
})

export class PageModule {

}
