import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductAdvisorChatComponent } from './product-advisor-chat/product-advisor-chat.component';
import { ProductAdvisorPageComponent } from './product-advisor-page.component';
import { ProductAdvisorResultsComponent } from './product-advisor-results/product-advisor-results.component';

const productAdvisorPageRoutes: Routes = [{ path: '', component: ProductAdvisorPageComponent }];

@NgModule({
  imports: [NgbNavModule, RouterModule.forChild(productAdvisorPageRoutes), SharedModule],
  declarations: [ProductAdvisorChatComponent, ProductAdvisorPageComponent, ProductAdvisorResultsComponent],
})
export class ProductAdvisorPageModule {}
