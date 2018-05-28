import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  navbarCollapsed = true;
}
