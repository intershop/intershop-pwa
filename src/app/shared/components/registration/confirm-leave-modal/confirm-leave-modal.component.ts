import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ish-confirm-leave-modal',
  templateUrl: './confirm-leave-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslatePipe],
})
export class ConfirmLeaveModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
