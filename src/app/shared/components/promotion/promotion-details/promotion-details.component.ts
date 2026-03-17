import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { ModalDialogLinkComponent } from 'ish-shared/components/common/modal-dialog-link/modal-dialog-link.component';

/**
 * The Promotion Details Component displays a link to a modal dialog
 * This dialog provides information in detail about the specified promotion.
 *
 * @example
 * <ish-promotion-details
 *   [promotion]="promotion"
 * ></ish-promotion-details>
 */
@Component({
  selector: 'ish-promotion-details',
  templateUrl: './promotion-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslatePipe, ModalDialogLinkComponent, NgClass, ServerHtmlDirective],
})
export class PromotionDetailsComponent {
  @Input({ required: true }) promotion: Promotion;
}
