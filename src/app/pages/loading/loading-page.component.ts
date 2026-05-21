import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-loading-page',
  standalone: false,
  templateUrl: './loading-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingPageComponent {}
