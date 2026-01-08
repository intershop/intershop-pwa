import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { IdentityProviderLoginComponent } from 'ish-shared/components/login/identity-provider-login/identity-provider-login.component';

@Component({
  selector: 'ish-login-modal',
  templateUrl: './login-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, TranslateModule, ServerHtmlDirective, IdentityProviderLoginComponent],
})
export class LoginModalComponent {
  @Input() loginMessageKey: string;
  @Output() readonly closeModal = new EventEmitter<void>();

  constructor(private cdRef: ChangeDetectorRef) {}

  // not-dead-code
  detectChanges() {
    this.cdRef.detectChanges();
  }

  hide() {
    this.closeModal.emit();
  }
}
