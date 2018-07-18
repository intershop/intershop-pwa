import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-loading-spinner',
  template: '<div class="loading-spinner"></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {}
