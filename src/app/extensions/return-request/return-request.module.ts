import { NgModule } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from 'ish-shared/shared.module';

import { ReturnRequestItemsComponent } from './components/return-request-items/return-request-items.component';
import { ReturnRequestProductInfoComponent } from './components/return-request-product-info/return-request-product-info.component';
import { ReturnableItemsComponent } from './components/returnable-items/returnable-items.component';
import { ReturnOverviewPageComponent } from './pages/return-overview/return-overview-page.component';
import { ReturnRequestDetailPageComponent } from './pages/return-request-detail/return-request-detail-page.component';
import { ReturnRequestModalComponent } from './shared/return-request-modal/return-request-modal.component';

@NgModule({
  imports: [NgbNavModule, SharedModule],
  declarations: [
    ReturnableItemsComponent,
    ReturnOverviewPageComponent,
    ReturnRequestDetailPageComponent,
    ReturnRequestItemsComponent,
    ReturnRequestModalComponent,
    ReturnRequestProductInfoComponent,
  ],
  exports: [NgbNavModule, SharedModule],
})
export class ReturnRequestModule {}
