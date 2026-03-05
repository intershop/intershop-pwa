import { DOCUMENT, NgIf } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { v4 as uuid } from 'uuid';

/**
 * @description
 * This component can be wrapped around listings to provide better accessibility support for
 * longer listings by adding a skip link.
 *
 * The skip link is only visible when it receives keyboard focus (similar to the "Skip to main content" link)
 * and skips to the element with the ID provided by the `skipToElementId` input parameter.
 *
 * If no `skipToElementId` is provided or the ID is invalid, the component generates a
 * target element after the listing where the focus is set on.
 *
 * If a valid `skipToElementId` is provided, the component does not have to be wrapped around a listing element,
 * since it does not have to generate a target element after the listing.
 *
 * IMPORTANT: If the target element is not natively focusable (like a button or link),
 * the element needs a `tabindex="-1"` to be programmatically focusable (like `breadcrumb.component.html`).
 *
 * The skip link is not visible on mobile and tablet.
 *
 * @example
 * <ish-skip-content-link>
 *   <ul>...</ul>
 * </ish-skip-content-link>
 *
 * @example
 * <ish-skip-content-link skipToElementId="validElementId" />
 * <ul>...</ul>
 */
@Component({
  selector: 'ish-skip-content-link',
  templateUrl: './skip-content-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, TranslatePipe],
})
export class SkipContentLinkComponent implements AfterContentInit, AfterViewInit {
  /**
   * Translation key for the skip link text.
   */
  @Input() linkText = 'common.skip_content.link.text.default';
  /**
   * A valid element-ID to skip to when the link is clicked.
   * If not natively focusable (like a button or link), add `tabindex="-1"` to the target element.
   */
  @Input() skipToElementId: string;

  @ViewChild('skipContentLink') skipContentLinkElementRef: ElementRef;

  generatedElementAfterListingId: string;

  constructor(@Inject(DOCUMENT) private document: Document, private renderer: Renderer2) {}

  // cannot set the ID in `ngAfterViewInit()` because the ID in the HTML would be undefined
  ngAfterContentInit() {
    if (this.isTargetElementIdMissingOrInvalid()) {
      // setting this variable will generate an empty target element after the listing
      this.generatedElementAfterListingId = `element-after-listing-${uuid()}`;
    }
  }

  // click-listener has to be set here because the `skipContentLinkElementRef` is not yet available in `ngAfterContentInit()`
  ngAfterViewInit() {
    this.setCustomClickListenerForSkipLink();
  }

  /**
   * Sets up a custom click listener for the skip link to handle focus and scrolling.
   */
  private setCustomClickListenerForSkipLink() {
    this.renderer.listen(this.skipContentLinkElementRef.nativeElement, 'click', (event: Event) => {
      event.preventDefault();

      const targetElement = this.document.getElementById(this.skipToElementId || this.generatedElementAfterListingId);

      if (targetElement) {
        targetElement.focus({ preventScroll: true });
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  private isTargetElementIdMissingOrInvalid(): boolean {
    return !this.skipToElementId || !this.document.getElementById(this.skipToElementId);
  }
}
