import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { InstantSearchFacade } from 'ish-core/facades/instant-search.facade';

@Component({
  selector: 'ish-instantsearch-input',
  templateUrl: './instantsearch-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstantsearchInputComponent implements OnInit, AfterViewInit {
  @ViewChild('searchInput') searchInput: ElementRef;

  defaultSearchTerm: string;

  constructor(private instantSearchFacade: InstantSearchFacade) {}

  ngOnInit(): void {
    this.defaultSearchTerm = this.instantSearchFacade.get('query') ?? '';
  }

  ngAfterViewInit(): void {
    if (!SSR) {
      this.searchInput.nativeElement.focus();
    }
  }

  searchSuggest(source: string | EventTarget) {
    this.instantSearchFacade.set({ query: typeof source === 'string' ? source : (source as HTMLDataElement).value });
  }

  resetSuggest() {
    this.instantSearchFacade.set({ query: '' });
    this.searchInput.nativeElement.value = '';
  }
}
