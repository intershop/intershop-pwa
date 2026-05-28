import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { BasketApproval } from 'ish-core/models/basket-approval/basket-approval.model';
import { ModalDialogLinkComponent } from 'ish-shared/components/common/modal-dialog-link/modal-dialog-link.component';

/**
 * Displays the basket approval info (link with modal)
 *
 */
@Component({
  selector: 'ish-basket-approval-info',
  templateUrl: './basket-approval-info.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [ModalDialogLinkComponent, NgClass, ServerHtmlDirective, TranslatePipe],
})
export class BasketApprovalInfoComponent {
  @Input({ required: true }) approval: BasketApproval;

  @ViewChild(ModalDialogLinkComponent)
  modalComponent: ModalDialogLinkComponent;

  /**
   * Callback function to hide modal dialog (used with ishServerHtml). - is needed for closing the dialog after the user clicks a message link
   */
  get callbackHideDialogModal() {
    return () => {
      this.modalComponent.hide();
    };
  }
}
