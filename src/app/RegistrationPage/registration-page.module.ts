import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RegistrationPageComponent } from './registration-page.component'
import { RouterModule, Routes } from '@angular/router';
import { registrationPageRoute } from './registration-page.routes'

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(registrationPageRoute),
    ],
    declarations: [RegistrationPageComponent],
    providers: []
})

export class RegistrationPageModule {

}
