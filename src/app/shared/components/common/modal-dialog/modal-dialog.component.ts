import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

export interface ModalOptions {
  /**
   * Modal title string.
   */
  titleText: string;
  /**
   * size attribute
   *   'sm': small, 'lg': large, 'xl': extra large, 'md': medium (default)
   */
  size?: 'sm' | 'lg' | 'xl';
  /**
   * Optional modal confirm button text.
   */
  confirmText?: string;
  /**
   * Optional modal confirm button disabled.
   */
  confirmDisabled?: boolean;
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
export class ModalDialogComponent<T> {
  @Input() options: ModalOptions;

  @Output() confirmed = new EventEmitter<T>();

  @Output() onClosed = new EventEmitter<T>();

  @ViewChild('template') modalDialogTemplate: TemplateRef<unknown>;

  ngbModalRef: NgbModalRef;

  data: T;

  constructor(private ngbModal: NgbModal) {}

  /**
   * Configure and show modal dialog.
   */
  show(data?: T) {
    if (data) {
      this.data = data;
    }

    const size = this.options && this.options.size ? this.options.size : undefined;

    this.ngbModalRef = this.ngbModal.open(this.modalDialogTemplate, { size });
  }

  /**
   * Hides modal dialog.
   */
  hide() {
    this.ngbModalRef.close();
    this.onClosed.emit(this.data);
  }

  /**
   * Emits input data or undefined and hides modal.
   */
  confirm() {
    this.confirmed.emit(this.data);
    this.hide();
  }
}
