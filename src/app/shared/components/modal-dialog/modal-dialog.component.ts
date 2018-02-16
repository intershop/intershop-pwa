import { Component, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ish-modal-dialog',
  templateUrl: './modal-dialog.component.html'
})

export class ModalDialogComponent {

  @Input() title: string;

  @ViewChild('modalDialog') modalDialog: ModalDirective;

  /**
   * Shows modal dialog
   */
  show(): void {
    this.modalDialog.show();
  }
}
