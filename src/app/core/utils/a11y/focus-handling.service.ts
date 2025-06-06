import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

/**
 * Service to handle focus management after navigation.
 * Automatically sets focus on the main content after page navigation,
 * improving accessibility for keyboard and screen reader users.
 */
@Injectable({ providedIn: 'root' })
export class FocusHandlingService implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private router: Router) {}

  /**
   * Initialize focus handling.
   * This should be called once during application initialization.
   */
  initialize(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.setFocusToMainContent();
      });
  }

  /**
   * Sets focus to the main content element after navigation.
   * This helps users who rely on keyboard navigation or screen readers
   * to skip directly to the main content without having to tab through navigation elements.
   */
  private setFocusToMainContent(): void {
    // Give the DOM time to update after navigation
    setTimeout(() => {
      // Try to find the main content element by id first
      const mainHeader = document.querySelector('#main-content-header') as HTMLElement;
      if (mainHeader) {
        mainHeader.focus();
        return;
      }

      // If no specific header element exists, try the main element
      const mainElement = document.querySelector('main') as HTMLElement;
      if (mainElement) {
        mainElement.focus();
        return;
      }

      // Fallback to role="main" if a main element doesn't exist
      const mainRole = document.querySelector('[role="main"]') as HTMLElement;
      if (mainRole) {
        mainRole.focus();
      }
    }, 100); // Small delay to ensure DOM updates are complete
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
