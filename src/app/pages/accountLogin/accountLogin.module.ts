import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router'
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AccountLoginRoute} from './accountLogin.routes';
import {AccountLoginComponent} from './accountLogin.component';


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
