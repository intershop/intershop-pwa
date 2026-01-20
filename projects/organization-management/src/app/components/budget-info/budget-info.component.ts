import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { IconModule } from 'ish-core/icon.module';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
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
  standalone: true,
  imports: [AsyncPipe, IconModule, NgIf, NgbPopoverModule, TranslateModule, ServerSettingPipe, ServerHtmlDirective],
})
@GenerateLazyComponent()
export class BudgetInfoComponent {
  /** translation key for a further message text after the main message */
  @Input() suffix = '';

  customer$ = this.accountFacade.customer$;

  constructor(private accountFacade: AccountFacade) {}
}
