import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';

import { ModalDialogComponent, ModalOptions } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

/**
 * The Modal Dialog Link Component
 *
 * Displays a link (see parameter linkText). If the user clicks the link a modal dialog opens displaying some information ( dynamic input content ).
 * The component is not designed or intended to contain any logic, but only to display text.
 *
 * @example
 *<ish-modal-dialog-link
    linkText="checkout.tac.link"
    [options]="{ titleText: 'checkout.termsandconditions.details.title' | translate, size: 'lg' }"
  >
    <ish-content-include includeId="systeminclude.dialog.privacyPolicy.pagelet2-Include"></ish-content-include>
  </ish-modal-dialog-link>
 */
@Component({
  selector: 'ish-modal-dialog-link',
  templateUrl: './modal-dialog-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDialogLinkComponent {
  /**
   * Link Text (translation key).
   */
  @Input() linkText: string;

  /**
   * Modal dialog options (see also @ModalDialogComponent).
   */
  @Input() options: ModalOptions;

  @ViewChild('modalDialog') modal: ModalDialogComponent<unknown>;

  /** enable parent components to close the modal */
  hide() {
    this.modal.hide();
  }
}
