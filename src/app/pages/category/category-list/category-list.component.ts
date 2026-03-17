
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CategoryTileComponent } from '../category-tile/category-tile.component';

@Component({
  selector: 'ish-category-list',
  templateUrl: './category-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ CategoryTileComponent],
})
export class CategoryListComponent {
  @Input({ required: true }) categories: string[];
}
