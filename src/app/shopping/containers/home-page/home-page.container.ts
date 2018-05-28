import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-home-page-container',
  templateUrl: './home-page.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageContainerComponent {}
