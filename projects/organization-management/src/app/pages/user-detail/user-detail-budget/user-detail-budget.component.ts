import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { PricePipe } from 'ish-core/models/price/price.pipe';

import { UserBudget } from '../../../models/user-budget/user-budget.model';

/**
 * displays the user budget and the appropriate budget bar
 */
@Component({
  selector: 'ish-user-detail-budget',
  templateUrl: './user-detail-budget.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PricePipe, RouterLink, TranslatePipe],
})
export class UserDetailBudgetComponent {
  @Input({ required: true }) budget: UserBudget;
}
