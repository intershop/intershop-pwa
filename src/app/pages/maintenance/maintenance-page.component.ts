import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';

@Component({
  selector: 'ish-maintenance-page',
  imports: [ServerHtmlDirective, TranslatePipe],
  standalone: true,
  templateUrl: './maintenance-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaintenancePageComponent {}
