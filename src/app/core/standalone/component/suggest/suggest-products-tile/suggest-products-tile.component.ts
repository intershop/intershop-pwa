import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';

import { Product } from 'ish-core/models/product/product.model';
import { PipesModule } from 'ish-core/pipes.module';

@Component({
  selector: 'ish-suggest-products-tile',
  templateUrl: './suggest-products-tile.component.html',
  standalone: true,
  imports: [CommonModule, PipesModule, TranslateModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestProductsTileComponent {
  @Input() products: Product[];
  @Input() maxAutoSuggests: number;
  @Input() inputTerms$ = new ReplaySubject<string>(1);
  @Output() submitSearch = new EventEmitter<string>();

  submit(term: string) {
    this.submitSearch.emit(term);
  }
}
