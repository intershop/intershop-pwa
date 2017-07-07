import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {pageRoute} from './pages.routes'
import {RouterModule} from '@angular/router'
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(pageRoute),
    ],
    declarations: [],
    providers: []
})

export class PageModule {

}
