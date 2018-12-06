import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-home-page',
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
