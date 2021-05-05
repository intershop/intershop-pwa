import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ish-confirm-leave-modal',
  templateUrl: './confirm-leave-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmLeaveModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
