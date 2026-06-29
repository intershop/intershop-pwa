import { AsyncPipe, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';

import { Keyword } from 'ish-core/models/keyword/keyword.model';
import { HighlightPipe } from 'ish-core/pipes/highlight.pipe';

@Component({
  selector: 'ish-suggest-keywords',
  imports: [AsyncPipe, HighlightPipe, SlicePipe, TranslatePipe],
  standalone: true,
  templateUrl: './suggest-keywords.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestKeywordsComponent {
  @Input() keywords: Keyword[];
  @Input() maxAutoSuggests: number;
  @Input() inputTerms$ = new ReplaySubject<string>(1);
  @Output() readonly submitSearch = new EventEmitter<string>();

  submit(term: string) {
    this.submitSearch.emit(term);
  }
}
