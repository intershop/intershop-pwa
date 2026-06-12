import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

/**
 * The Budget Info Component display an info icon containing a message which budget type (gross or net) is used.
 *
 */
@Component({
  selector: 'ish-budget-info',
  templateUrl: './budget-info.component.html',
  styleUrls: ['./budget-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class BudgetInfoComponent {
  /** translation key for a further message text after the main message */
  @Input() suffix = '';

  customer$ = this.accountFacade.customer$;

  constructor(private accountFacade: AccountFacade) {}
}
