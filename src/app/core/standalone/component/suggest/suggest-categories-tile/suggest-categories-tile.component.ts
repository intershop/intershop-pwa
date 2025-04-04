import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, ReplaySubject } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { PipesModule } from 'ish-core/pipes.module';

@Component({
  selector: 'ish-suggest-categories-tile',
  templateUrl: './suggest-categories-tile.component.html',
  standalone: true,
  imports: [CommonModule, PipesModule, TranslateModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestCategoriesTileComponent {
  @Input() categories: Category[];
  @Input() maxAutoSuggests: number;
  @Input() inputTerms$ = new ReplaySubject<string>(1);
  @Output() routeChange = new EventEmitter<void>();

  private noImageImageUrl = '/assets/img/not-available.svg';

  constructor(private shoppingFacade: ShoppingFacade) {}

  getCategoryImageUrl(images: { effectiveUrl?: string }[]): string {
    return images?.[0]?.effectiveUrl || this.noImageImageUrl;
  }

  getCategoryView(uniqueId: string): Observable<CategoryView> {
    return this.shoppingFacade.category$(uniqueId);
  }

  handleInputFocus(): void {
    this.routeChange.emit();
  }
}
