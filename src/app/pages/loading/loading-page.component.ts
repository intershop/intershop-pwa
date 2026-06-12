import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-loading-page',
  templateUrl: './loading-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingPageComponent {}
