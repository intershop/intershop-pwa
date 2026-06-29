import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CategoryTileComponent } from '../category-tile/category-tile.component';

@Component({
  selector: 'ish-category-list',
  imports: [CategoryTileComponent],
  standalone: true,
  templateUrl: './category-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryListComponent {
  @Input({ required: true }) categories: string[];
}
