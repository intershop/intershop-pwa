import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { ImageLoading } from 'ish-core/models/image/image.model';

/**
 * The Category Tile Component renders a category tile with the image of the
 * category using {@link CategoryImageComponent}.
 *
 * @example
 * <ish-category-tile [categoryUniqueId]="category" />
 */
@Component({
  selector: 'ish-category-tile',
  templateUrl: './category-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryTileComponent implements OnInit {
  /**
   * The Category to render a tile for
   */
  @Input({ required: true }) categoryUniqueId: string;
  @Input() loading: ImageLoading;

  category$: Observable<CategoryView>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.category$ = this.shoppingFacade.category$(this.categoryUniqueId);
  }
}
