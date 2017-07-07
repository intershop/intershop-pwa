import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AccountLoginRoute } from "app/pages/accountLogin/accountLogin.routes";
import { AccountLoginComponent } from 'app/pages/accountLogin/accountLogin.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AccountLoginRoute),
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [AccountLoginComponent],
    providers: []
})

export class AccountLoginModule {

}
