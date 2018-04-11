import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ish-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDialogComponent {
  @Input() title: string;

  // tslint:disable-next-line:no-any
  @ViewChild('template') modalDialogTemplate: TemplateRef<any>;
  bsModalDialog: BsModalRef;

  constructor(private bsModalService: BsModalService) {}

  /**
   * Shows modal dialog
   */
  show() {
    this.bsModalDialog = this.bsModalService.show(this.modalDialogTemplate);
  }

  /**
   * Hides modal dialog
   */
  hide() {
    this.bsModalDialog.hide();
  }
}
