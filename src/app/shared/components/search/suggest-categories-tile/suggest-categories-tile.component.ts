import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, ReplaySubject, first, map, switchMap } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
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
export class SuggestCategoriesTileComponent implements OnInit {
  @Input() categories: Category[];
  @Input() maxAutoSuggests: number;
  @Input() inputTerms$ = new ReplaySubject<string>(1);
  @Output() routeChange = new EventEmitter<void>();

  private staticURL: string;
  private noImageImageUrl = '/not_available.png';
  private destroyRef = inject(DestroyRef);
  private categoryTree$: Observable<CategoryTree>;

  constructor(private appFacade: AppFacade, private shoppingFacade: ShoppingFacade) {}

  ngOnInit(): void {
    this.appFacade.getStaticEndpoint$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(staticURL => {
      this.staticURL = staticURL;
      this.noImageImageUrl = `${this.staticURL}${this.noImageImageUrl}`;
    });
    this.categoryTree$ = this.shoppingFacade.getCategoryTree();
  }

  getCategoryImageUrl(images: { effectiveUrl?: string }[]): string {
    let image = this.noImageImageUrl;
    if (images && images.length > 0) {
      image = !images[0].effectiveUrl.match('^(https?|file):')
        ? `${this.staticURL}/${images[0].effectiveUrl}`
        : images[0].effectiveUrl;
    }

    return image;
  }

  getCategoryView(uniqueId: string): Observable<CategoryView> {
    return this.categoryTree$.pipe(
      map(tree => Object.keys(tree.nodes)),
      map(nodes => nodes.filter(node => node.includes(uniqueId))),
      first(),
      switchMap(ids => this.shoppingFacade.category$(ids[0]))
    );
  }

  handleInputFocus(): void {
    this.routeChange.emit();
  }
}
