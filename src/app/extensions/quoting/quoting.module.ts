import { NgModule } from '@angular/core';

import { QuotingRoutingModule } from './pages/quoting-routing.module';
import { QuotingStoreModule } from './store/quoting-store.module';

@NgModule({
  imports: [QuotingRoutingModule, QuotingStoreModule],
})
export class QuotingModule {}
