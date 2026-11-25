import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { AiSearchFacade } from '../../facades/ai-search.facade';
import { AiSearchAnswerHelper } from '../../models/ai-search-answer/ai-search-answer.helper';

interface AiSearchAnswerView {
  loading: boolean;
  html?: string;
}

/**
 * Displays the answer box with the AI answer to the search query above the product list of the search results page:
 * a placeholder while the AI answer is generated, then the shortened AI answer with "Read more", the AI-generated
 * notice, and the link to the AI Product Advisor. Shows nothing when the search query has no AI answer.
 *
 * @example
 * <ish-ai-search-answer-box [searchQuery]="searchTerm" />
 */
@Component({
  selector: 'ish-ai-search-answer-box',
  standalone: false,
  templateUrl: './ai-search-answer-box.component.html',
  styleUrls: ['./ai-search-answer-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class AiSearchAnswerBoxComponent implements OnChanges {
  @Input({ required: true }) searchQuery: string;

  answer$: Observable<AiSearchAnswerView>;
  expanded = false;
  truncated = false;

  private answerElement: HTMLElement;
  private resizeObserver: ResizeObserver;
  private destroyRef = inject(DestroyRef);

  constructor(
    private aiSearchFacade: AiSearchFacade,
    private cd: ChangeDetectorRef
  ) {
    this.destroyRef.onDestroy(() => this.resizeObserver?.disconnect());
  }

  // UC-001 BR-006: "Read more" only when the AI answer is longer than the shortened text.
  @ViewChild('answerText') set answerText(element: ElementRef<HTMLElement>) {
    this.answerElement = element?.nativeElement;
    this.resizeObserver?.disconnect();
    if (!element || typeof ResizeObserver === 'undefined') {
      return;
    }
    this.resizeObserver = new ResizeObserver(() => {
      const { scrollHeight, clientHeight } = element.nativeElement;
      const truncated = scrollHeight > clientHeight + 1;
      if (truncated !== this.truncated) {
        this.truncated = truncated;
        this.cd.markForCheck();
      }
    });
    this.resizeObserver.observe(element.nativeElement);
  }

  ngOnChanges() {
    this.expanded = false;
    this.answer$ = this.aiSearchFacade.answer$(this.searchQuery).pipe(
      // the AI answer is kept for the browser tab once it is shown
      tap(state => state?.answer && this.aiSearchFacade.keepAnswer(state.answer)),
      map(state => state && { loading: state.loading, html: AiSearchAnswerHelper.toHtml(state.answer?.text) })
    );
  }

  expand() {
    this.expanded = true;
    this.truncated = false;
    // UC-001 NFR-006: "Read more" disappears, so the keyboard focus continues at the full AI answer.
    this.answerElement?.focus();
  }
}
