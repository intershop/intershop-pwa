import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';

import { SuggestCategoriesTileComponent } from 'ish-shared/components/search/suggest-categories-tile/suggest-categories-tile.component';

@Component({
  selector: 'ish-suggest-categories',
  imports: [TranslatePipe, SlicePipe, SuggestCategoriesTileComponent],
  templateUrl: './suggest-categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestCategoriesComponent {
  @Input({ required: true }) categories: string[];
  @Input() maxAutoSuggests: number;
  @Input() inputTerms$ = new ReplaySubject<string>(1);
  @Output() readonly routeChange = new EventEmitter<void>();

  handleInputFocus(): void {
    this.routeChange.emit();
  }
}
