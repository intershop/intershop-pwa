import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-accordion',
  standalone: true,
  templateUrl: './accordion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionComponent {}
