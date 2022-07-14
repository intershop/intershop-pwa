import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef, ViewChild } from '@angular/core';

import { LazyContentDirective } from 'ish-core/directives/lazy-content.directive';
import { ModalDialogComponent, ModalOptions } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

/**
 * The Modal Dialog Link Component
 *
 * Displays a link (see parameter linkText). If the user clicks the link a modal dialog opens displaying some information ( dynamic input content ).
 * The input content needs to be wrapped within a ng-container, which uses the LazyContentDirective. The component has now access to the template reference
 * and can lazy load the input content, when the modal is opened.
 * The component is not designed or intended to contain any logic, but only to display text.
 *
 * @example
 *<ish-modal-dialog-link
    linkText="checkout.tac.link"
    [options]="{ titleText: 'checkout.termsandconditions.details.title' | translate, size: 'lg' }"
  >
    <ng-container *ishLazyContent>
      <ish-content-include includeId="include.dialog.privacyPolicy.pagelet2-Include"></ish-content-include>
    </ng-container>
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

  @ContentChild(LazyContentDirective, { read: TemplateRef, static: true }) template: TemplateRef<any>;

  /** enable parent components to close the modal */
  hide() {
    this.modal.hide();
  }
}
