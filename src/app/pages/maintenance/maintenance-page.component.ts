import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-maintenance-page',
  standalone: false,
  templateUrl: './maintenance-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaintenancePageComponent {}
