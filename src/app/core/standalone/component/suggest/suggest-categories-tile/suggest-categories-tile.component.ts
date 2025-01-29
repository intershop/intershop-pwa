import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Category } from 'ish-core/models/category/category.model';

@Component({
  selector: 'ish-suggest-categories-tile',
  templateUrl: './suggest-categories-tile.component.html',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestCategoriesTileComponent {
  @Input() categories: Category[];
}
