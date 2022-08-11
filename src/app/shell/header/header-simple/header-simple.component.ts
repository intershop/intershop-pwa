import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ish-header-simple',
  templateUrl: './header-simple.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderSimpleComponent {
  constructor(private router: Router) {}

  routeToHome() {
    if (this.router.url === '/maintenance') {
      window.location.reload();
    }
  }
}
