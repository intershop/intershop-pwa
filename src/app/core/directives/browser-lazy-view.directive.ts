import {
  DestroyRef,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  Host,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, takeUntil } from 'rxjs';

import { fromIntersectionObserver } from './intersection-observer-util';

function findElement(element: { parentElement: HTMLElement } | HTMLElement): HTMLElement {
  if (element instanceof HTMLElement) {
    return element;
  }
  if (element.parentElement) {
    return findElement(element.parentElement);
  }
}

@Directive({
  selector: '[ishBrowserLazyView]',
})
export class BrowserLazyViewDirective implements OnInit {
  private view: EmbeddedViewRef<unknown>;

  private destroyRef = inject(DestroyRef);
  private viewCreated$ = new Subject<void>();

  constructor(
    private viewContainer: ViewContainerRef,
    private template: TemplateRef<unknown>,
    @Host() private element: ElementRef
  ) {}

  ngOnInit() {
    if (!SSR) {
      const element = findElement(this.element.nativeElement);
      if (!element) {
        console.warn('No element found for BrowserLazyViewDirective');
        return;
      }
      fromIntersectionObserver(element)
        .pipe(takeUntil(this.viewCreated$), takeUntilDestroyed(this.destroyRef))
        .subscribe(status => {
          if (status === 'Visible' && !this.view) {
            this.view = this.viewContainer.createEmbeddedView(this.template);
            this.view.markForCheck();
            this.viewCreated$.next();
          }
        });
    }
  }
}
