import { NgModule } from '@angular/core';

import { LazyBudgetWidgetComponent } from './lazy-budget-widget/lazy-budget-widget.component';
import { LazyCostCenterWidgetComponent } from './lazy-cost-center-widget/lazy-cost-center-widget.component';

@NgModule({
  imports: [],
  declarations: [LazyBudgetWidgetComponent, LazyCostCenterWidgetComponent],
  exports: [LazyBudgetWidgetComponent, LazyCostCenterWidgetComponent],
})
export class OrganizationManagementExportsModule {}
