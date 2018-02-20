import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'ish-modal-dialog',
  templateUrl: './modal-dialog.component.html'
})

export class ModalDialogComponent {

  @Input() title: string;

  @ViewChild('template') modalDialogTemplate: TemplateRef<any>;
  bsModalDialog: BsModalRef;

  constructor(
    private bsModalService: BsModalService
  ) { }

  /**
   * Shows modal dialog
   */
  show(): void {
    this.bsModalDialog = this.bsModalService.show(this.modalDialogTemplate);
  }

  /**
   * Hides modal dialog
   */
  hide(): void {
    this.bsModalDialog.hide();
  }
}
