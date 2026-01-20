import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from 'ish-core/icon.module';
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
  imports: [IconModule, NgIf, RouterModule, TranslateModule, PricePipe],
})
export class UserDetailBudgetComponent {
  @Input({ required: true }) budget: UserBudget;
}
