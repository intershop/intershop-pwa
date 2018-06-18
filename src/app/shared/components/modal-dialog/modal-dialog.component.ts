import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

export interface ModalOptions {
  /**
   * Modal title string.
   */
  titleText: string;
  /**
   * Additional CSS classes for styling purposes,
   * e.g. for sizing:
   *   'modal-lg': large, 'modal-sm': small, 'modal-md': medium (default)
   */
  modalClass?: string;
  /**
   * Optional modal confirm button text.
   */
  confirmText?: string;
  /**
   * Optional modal reject button text.
   */
  rejectText?: string;
}

/**
 * The Modal Dialog Component displays a generic modal, that shows a custom title and custom content.
 * It provides an optional footer that includes confirm and reject buttons.
 * It is possible to pass any data on show.
 * The also provided confirmed output emitter will return the previously passed data if the modal gets confirmed.
 *
 * @example
 * <ish-modal-dialog [options]="options" (confirmed)="onConfirmed($event)">
 *   Dummy content
 * </ish-modal-dialog>
 */
@Component({
  selector: 'ish-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDialogComponent {
  @Input() options: ModalOptions;

  // tslint:disable-next-line:no-any
  @Output() confirmed = new EventEmitter<any>();

  // tslint:disable-next-line:no-any
  @ViewChild('template') modalDialogTemplate: TemplateRef<any>;

  bsModalDialog: BsModalRef;

  // tslint:disable-next-line:no-any
  data: any;

  constructor(private bsModalService: BsModalService) {}

  /**
   * Configure and show modal dialog.
   */
  // tslint:disable-next-line:no-any
  show(data?: any) {
    if (data) {
      this.data = data;
    }

    const modalClass = this.options && this.options.modalClass ? this.options.modalClass : '';

    this.bsModalDialog = this.bsModalService.show(this.modalDialogTemplate, { class: modalClass });
  }

  /**
   * Hides modal dialog.
   */
  hide() {
    this.bsModalDialog.hide();
  }

  /**
   * Emits input data or undefined and hides modal.
   */
  confirm() {
    this.confirmed.emit(this.data);
    this.hide();
  }
}
