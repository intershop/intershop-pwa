import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { UserBudget } from '../../../models/user-budget/user-budget.model';

/**
 * displays the user budget and the appropriate budget bar
 */
@Component({
  selector: 'ish-user-detail-budget',
  templateUrl: './user-detail-budget.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class UserDetailBudgetComponent {
  @Input() budget: UserBudget;
}
