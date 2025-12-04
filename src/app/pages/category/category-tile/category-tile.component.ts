import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { CategoryRoutePipe } from 'ish-core/routing/category/category-route.pipe';
import { CategoryImageComponent } from 'ish-shared/components/category/category-image/category-image.component';

/**
 * The Category Tile Component renders a category tile with the image of the
 * category using {@link CategoryImageComponent}.
 *
 * @example
 * <ish-category-tile [categoryUniqueId]="category"></ish-category-tile>
 */
@Component({
  selector: 'ish-category-tile',
  templateUrl: './category-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterLink, CategoryRoutePipe, CategoryImageComponent],
})
export class CategoryTileComponent implements OnInit {
  /**
   * The Category to render a tile for
   */
  @Input({ required: true }) categoryUniqueId: string;

  category$: Observable<CategoryView>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.category$ = this.shoppingFacade.category$(this.categoryUniqueId);
  }
}
