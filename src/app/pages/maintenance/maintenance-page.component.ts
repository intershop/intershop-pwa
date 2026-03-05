import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';

@Component({
  selector: 'ish-maintenance-page',
  templateUrl: './maintenance-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslateModule, ServerHtmlDirective],
})
export class MaintenancePageComponent {}
