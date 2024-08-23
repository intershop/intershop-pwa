import { NgModule } from '@angular/core';

import { LazyBudgetWidgetComponent } from './lazy-budget-widget/lazy-budget-widget.component';
import { LazyBuyersSelectComponent } from './lazy-buyers-select/lazy-buyers-select.component';
import { LazyCostCenterWidgetComponent } from './lazy-cost-center-widget/lazy-cost-center-widget.component';

@NgModule({
  imports: [],
  declarations: [LazyBudgetWidgetComponent, LazyBuyersSelectComponent, LazyCostCenterWidgetComponent],
  exports: [LazyBudgetWidgetComponent, LazyBuyersSelectComponent, LazyCostCenterWidgetComponent],
})
export class OrganizationManagementExportsModule {}
