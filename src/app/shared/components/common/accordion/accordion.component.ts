import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ish-accordion',
  standalone: false,
  templateUrl: './accordion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionComponent {}
