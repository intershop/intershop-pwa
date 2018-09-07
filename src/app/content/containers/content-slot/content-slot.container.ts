import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ContentSlot } from '../../../models/content-slot/content-slot.model';

@Component({
  selector: 'ish-content-slot',
  templateUrl: './content-slot.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentSlotContainerComponent {
  @Input()
  slot: ContentSlot;
}
