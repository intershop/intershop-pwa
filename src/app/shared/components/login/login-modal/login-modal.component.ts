import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ish-login-modal',
  templateUrl: './login-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginModalComponent {
  @Input() loginMessageKey: string;
  @Output() closeModal = new EventEmitter<void>();

  constructor(private cdRef: ChangeDetectorRef) {}

  // not-dead-code
  detectChanges() {
    this.cdRef.detectChanges();
  }

  hide() {
    this.closeModal.emit();
  }
}
