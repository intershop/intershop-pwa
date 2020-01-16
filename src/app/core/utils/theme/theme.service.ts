import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { distinctUntilChanged, filter } from 'rxjs/operators';

import { getTheme } from 'ish-core/store/configuration';

/**
 * Service to add the configured/selected theme’s CSS file in the HTML’s head.
 *
 * See: "Angular: Multiple Themes Without Killing Bundle Size (With Material or Not)" by @Kmathy15
 * https://medium.com/better-programming/angular-multiple-themes-without-killing-bundle-size-with-material-or-not-5a80849b6b34
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer: Renderer2;
  private head: HTMLElement;
  private themeLinks: HTMLElement[] = [];

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
    private store: Store<{}>
  ) {}

  init() {
    this.head = this.document.head;
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
    this.store
      .pipe(select(getTheme))
      .pipe(
        distinctUntilChanged(),
        filter(x => !!x)
      )
      .subscribe(async theme => {
        await this.loadCss(`${theme}.css`);

        // remove style of previous theme
        if (this.themeLinks.length === 2) {
          this.renderer.removeChild(this.head, this.themeLinks.shift());
        }
      });
  }

  private async loadCss(filename: string) {
    return new Promise(resolve => {
      const linkEl: HTMLElement = this.renderer.createElement('link');
      this.renderer.setAttribute(linkEl, 'rel', 'stylesheet');
      this.renderer.setAttribute(linkEl, 'type', 'text/css');
      this.renderer.setAttribute(linkEl, 'href', filename);
      this.renderer.setProperty(linkEl, 'onload', resolve);
      this.renderer.appendChild(this.head, linkEl);
      this.themeLinks = [...this.themeLinks, linkEl];
    });
  }
}
