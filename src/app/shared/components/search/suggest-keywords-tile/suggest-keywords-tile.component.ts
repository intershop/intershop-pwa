import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';

import { Keyword } from 'ish-core/models/keyword/keyword.model';
import { PipesModule } from 'ish-core/pipes.module';

@Component({
  selector: 'ish-suggest-keywords-tile',
  templateUrl: './suggest-keywords-tile.component.html',
  standalone: true,
  imports: [CommonModule, PipesModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestKeywordsTileComponent {
  @Input() keywords: Keyword[];
  @Input() maxAutoSuggests: number;
  @Input() inputTerms$ = new ReplaySubject<string>(1);
  @Output() submitSearch = new EventEmitter<string>();

  submit(term: string) {
    this.submitSearch.emit(term);
  }
}
