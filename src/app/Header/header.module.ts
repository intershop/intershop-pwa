import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {HeaderComponent} from './header.component'
import {RouterModule} from '@angular/router'

@NgModule({
    imports: [
    CommonModule,
    RouterModule
    ],
    exports: [
    HeaderComponent
    ],
    declarations: [HeaderComponent],
    providers: []
})

export class HeaderModule {

}
