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
 * <ish-promotion-details [promotion]="promotion" />
 */
@Component({
  selector: 'ish-promotion-details',
  imports: [ModalDialogLinkComponent, NgClass, ServerHtmlDirective, TranslatePipe],
  standalone: true,
  templateUrl: './promotion-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionDetailsComponent {
  @Input({ required: true }) promotion: Promotion;
}
