import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';

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

  categoryImageUrl = '/assets/img/not-available.svg';

  getCategoryImageUrl(images: { effectiveUrl?: string }[]): string {
    return images?.[0]?.effectiveUrl || this.categoryImageUrl;
  }

  handleInputFocus(): void {
    this.routeChange.emit();
  }
}
