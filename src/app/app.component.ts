import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  // DEBUG: prints the configured routes for routing analysis
  // constructor(private router: Router) { console.log('ROUTES: ', this.router.config); }
}
