import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsSharedModule } from '../../../forms/forms-shared.module';
import { SharedModule } from '../../../shared/shared.module';
import { BasketPageContainerComponent } from './basket-page.container';
import { basketPageRoutes } from './basket-page.routes';

@NgModule({
  imports: [RouterModule.forChild(basketPageRoutes), SharedModule, FormsSharedModule],
  declarations: [BasketPageContainerComponent],
})
export class BasketPageModule {}
