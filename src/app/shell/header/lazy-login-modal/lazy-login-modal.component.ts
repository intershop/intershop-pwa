import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ish-lazy-login-modal',
  templateUrl: './lazy-login-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class LazyLoginModalComponent {
  @Input() loginMessageKey: string;
  @Output() close = new EventEmitter<void>();
  componentLocation = {
    moduleId: 'ish-shared',
    selector: 'ish-login-modal',
  };

  hide = () => this.close.emit();
}
