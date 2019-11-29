import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ish-login-modal',
  templateUrl: './login-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginModalComponent {
  @Input() loginMessageKey: string;
  @Output() close = new EventEmitter<void>();

  hide() {
    this.close.emit();
  }
}
