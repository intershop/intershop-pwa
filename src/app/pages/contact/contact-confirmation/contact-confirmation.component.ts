import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * The Contact Confirmation Component show the customer the confirmation
 * or failure of his sent contact request
 *
 * @example
 * <ish-contact-confirmation [requestSucceeded]="requestSucceeded"></ish-contact-confirmation>
 */
@Component({
  selector: 'ish-contact-confirmation',
  templateUrl: './contact-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactConfirmationComponent {
  /**
   * 'success' state for the contact request
   * Controls whether the contact confirmation is displayed or an error. */
  @Input() success: boolean;
}
