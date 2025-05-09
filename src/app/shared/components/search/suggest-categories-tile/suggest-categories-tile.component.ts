import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { PipesModule } from 'ish-core/pipes.module';
import { CategoryImageComponent } from 'ish-shared/components/category/category-image/category-image.component';

@Component({
  selector: 'ish-suggest-categories-tile',
  templateUrl: './suggest-categories-tile.component.html',
  standalone: true,
  imports: [CommonModule, PipesModule, RouterModule, CategoryImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestCategoriesTileComponent implements OnInit {
  @Input({ required: true }) categoryUniqueId: string;
  @Input() inputTerms$ = new ReplaySubject<string>(1);
  @Output() routeChange = new EventEmitter<void>();

  category$: Observable<CategoryView>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.category$ = this.shoppingFacade.category$(this.categoryUniqueId);
  }

  handleInputFocus(): void {
    this.routeChange.emit();
  }
}
