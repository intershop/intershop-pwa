import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AccountNavigationComponent } from './components/account-navigation/account-navigation.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [AccountNavigationComponent],
  exports: [AccountNavigationComponent],
})
export class AccountSharedModule {}
