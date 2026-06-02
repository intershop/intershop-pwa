import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-accordion',
  templateUrl: './accordion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AccordionComponent {}
