import { NgModule } from '@angular/core';

import { LazyBudgetInfoComponent } from './lazy-budget-info/lazy-budget-info.component';
import { LazyBudgetWidgetComponent } from './lazy-budget-widget/lazy-budget-widget.component';
import { LazyBuyersSelectComponent } from './lazy-buyers-select/lazy-buyers-select.component';
import { LazyCostCenterWidgetComponent } from './lazy-cost-center-widget/lazy-cost-center-widget.component';

@NgModule({
  imports: [],
  declarations: [
    LazyBudgetInfoComponent,
    LazyBudgetWidgetComponent,
    LazyBuyersSelectComponent,
    LazyCostCenterWidgetComponent,
  ],
  exports: [
    LazyBudgetInfoComponent,
    LazyBudgetWidgetComponent,
    LazyBuyersSelectComponent,
    LazyCostCenterWidgetComponent,
  ],
})
export class OrganizationManagementExportsModule {}
