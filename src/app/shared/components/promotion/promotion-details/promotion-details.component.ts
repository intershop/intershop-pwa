import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Promotion } from 'ish-core/models/promotion/promotion.model';

/**
 * The Promotion Details Component displays a link to a modal dialog
 * This dialog provides information in detail about the specified promotion.
 *
 * @example
 * <ish-promotion-details [promotion]="promotion" />
 */
@Component({
  selector: 'ish-promotion-details',
  templateUrl: './promotion-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionDetailsComponent {
  @Input({ required: true }) promotion: Promotion;
}
