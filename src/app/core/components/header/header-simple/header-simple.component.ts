import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-header-simple',
  templateUrl: './header-simple.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderSimpleComponent {}
