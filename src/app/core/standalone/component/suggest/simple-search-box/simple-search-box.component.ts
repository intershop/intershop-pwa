import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { IconModule } from 'ish-core/icon.module';
import { SearchBoxConfiguration } from 'ish-core/models/search-box-configuration/search-box-configuration.model';
import { PipesModule } from 'ish-core/pipes.module';

/**
 * The search box container component
 *
 * prepares all data for the search box
 * uses input to display the search box
 *
 * @example
 * <ish-simple-search-box [configuration]="{placeholder: 'search.searchbox.instructional_text' | translate}"></ish-simple-search-box>
 */
@Component({
  selector: 'ish-simple-search-box',
  templateUrl: './simple-search-box.component.html',
  standalone: true,
  imports: [CommonModule, IconModule, PipesModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleSearchBoxComponent implements OnInit {
  /**
   * the search box configuration for this component
   */
  @Input() configuration: SearchBoxConfiguration;

  searchResults$: Observable<string[]>;
  inputSearchTerms$ = new ReplaySubject<string>(1);

  activeIndex = -1;
  inputFocused: boolean;

  private destroyRef = inject(DestroyRef);

  constructor(private shoppingFacade: ShoppingFacade, private router: Router) {}

  get usedIcon(): IconName {
    return this.configuration?.icon || 'search';
  }

  ngOnInit() {
    // initialize with searchTerm when on search route
    this.shoppingFacade.searchTerm$
      .pipe(
        map(x => (x ? x : '')),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(term => this.inputSearchTerms$.next(term));

    // suggests are triggered solely via stream
    this.searchResults$ = this.shoppingFacade.searchResults$(this.inputSearchTerms$) as Observable<string[]>;
  }
  blur() {
    this.inputFocused = false;
    this.activeIndex = -1;
  }

  focus() {
    this.inputFocused = true;
  }

  searchSuggest(source: string | EventTarget) {
    this.inputSearchTerms$.next(typeof source === 'string' ? source : (source as HTMLDataElement).value);
  }

  submitSearch(suggestedTerm: string) {
    if (!suggestedTerm) {
      return false;
    }

    // remove focus when switching to search page
    this.inputFocused = false;

    if (this.activeIndex !== -1) {
      // something was selected via keyboard
      this.searchResults$.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe(results => {
        this.router.navigate(['/search', results[this.activeIndex]]);
        this.activeIndex = -1;
      });
    } else {
      this.router.navigate(['/search', suggestedTerm]);
    }

    // prevent form submission
    return false;
  }

  selectSuggestedTerm(index: number) {
    this.searchResults$.pipe(take(1), takeUntilDestroyed(this.destroyRef)).subscribe(results => {
      if (
        (this.configuration?.maxAutoSuggests && index > this.configuration.maxAutoSuggests - 1) ||
        index < -1 ||
        index > results.length - 1
      ) {
        return;
      }
      this.activeIndex = index;
    });
  }
}
