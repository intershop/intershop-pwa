import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FamilyPageComponent } from './family-page.component'
import { RouterModule, Routes } from '@angular/router';
import { familyPageRoute } from './family-page.routes'

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(familyPageRoute),
    ],
    declarations: [FamilyPageComponent],
    providers: []
})

export class FamilyPageModule {

}
