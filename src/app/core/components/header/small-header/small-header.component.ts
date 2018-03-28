import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-small-header',
  templateUrl: './small-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmallHeaderComponent {
  navbarCollapsed = true;
}
