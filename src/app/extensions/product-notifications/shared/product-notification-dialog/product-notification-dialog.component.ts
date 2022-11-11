import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ish-product-notification-dialog',
  templateUrl: './product-notification-dialog.component.html',
  styleUrls: ['./product-notification-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductNotificationDialogComponent {
  modal: NgbModalRef;

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  constructor(private ngbModal: NgbModal) {}

  /** close modal */
  hide() {
    this.modal.close();
  }

  /** open modal */
  show() {
    this.modal = this.ngbModal.open(this.modalTemplate);
  }
}
