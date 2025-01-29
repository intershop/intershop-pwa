import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Brand } from 'ish-core/models/suggestion/suggestion.model';

@Component({
  selector: 'ish-suggest-brands-tile',
  templateUrl: './suggest-brands-tile.component.html',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestBrandsTileComponent {
  @Input() brands: Brand[];
}
