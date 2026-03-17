import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { HighlightPipe } from 'ish-core/pipes/highlight.pipe';
import { CategoryRoutePipe } from 'ish-core/routing/category/category-route.pipe';
import { CategoryImageComponent } from 'ish-shared/components/category/category-image/category-image.component';

@Component({
  selector: 'ish-suggest-categories-tile',
  templateUrl: './suggest-categories-tile.component.html',
  standalone: true,
  imports: [AsyncPipe, HighlightPipe, CategoryImageComponent, RouterLink, CategoryRoutePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestCategoriesTileComponent implements OnInit {
  @Input({ required: true }) categoryUniqueId: string;
  @Input() inputTerms$ = new ReplaySubject<string>(1);
  @Output() readonly routeChange = new EventEmitter<void>();

  category$: Observable<CategoryView>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.category$ = this.shoppingFacade.category$(this.categoryUniqueId);
  }

  handleInputFocus(): void {
    this.routeChange.emit();
  }
}
