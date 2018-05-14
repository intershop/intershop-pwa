import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ish-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDialogComponent {
  @Input() title: string;

  /**
   * Additional CSS classes for styling purposes,
   * e.g. for sizing:
   *   'modal-lg': large, 'modal-sm': small, 'modal-md': medium (default)
   */
  @Input() modalClass: string;

  // tslint:disable-next-line:no-any
  @ViewChild('template') modalDialogTemplate: TemplateRef<any>;
  bsModalDialog: BsModalRef;

  constructor(private bsModalService: BsModalService) {}

  /**
   * Shows modal dialog
   */
  show() {
    this.bsModalDialog = this.bsModalService.show(this.modalDialogTemplate, { class: this.modalClass });
  }

  /**
   * Hides modal dialog
   */
  hide() {
    this.bsModalDialog.hide();
  }
}
