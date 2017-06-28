import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HomePageComponent } from './home-page.component'
import { RouterModule, Routes } from '@angular/router';
import { homePageRoute } from './home-page.routes'

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(homePageRoute),
    ],
    declarations: [HomePageComponent],
    providers: []
})

export class HomePageModule {

}
