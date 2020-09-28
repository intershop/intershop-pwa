import { DOCUMENT, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2, isDevMode } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';

import { getTheme } from 'ish-core/store/core/configuration';
import { whenTruthy } from 'ish-core/utils/operators';

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
  private themePreloadLinks: HTMLElement[] = [];

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
    private store: Store,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.head = this.document.head;
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
  }

  private trySetAttribute(selector: string, attribute: string, value: string) {
    const el = this.document.querySelector(selector);
    if (el) {
      el.setAttribute(attribute, value);
    }
  }

  init() {
    this.store
      .pipe(
        takeWhile(() => isPlatformServer(this.platformId) || isDevMode()),
        select(getTheme),
        whenTruthy()
      )
      .subscribe(async theme => {
        const themeData = theme.split('|');
        const themeName = themeData[0];
        const themeColor = themeData[1];

        this.trySetAttribute('link[rel="icon"]', 'href', `assets/themes/${themeName}/img/favicon.ico`);
        this.trySetAttribute('link[rel="manifest"]', 'href', `assets/themes/${themeName}/manifest.webmanifest`);
        this.trySetAttribute(
          'link[rel="apple-touch-icon"]:not([sizes])',
          'href',
          `assets/themes/${themeName}/img/logo_apple_120x120.png`
        );
        this.trySetAttribute(
          'link[rel="apple-touch-icon"][sizes="152x152"]',
          'href',
          `assets/themes/${themeName}/img/logo_apple_152x152.png`
        );
        this.trySetAttribute(
          'link[rel="apple-touch-icon"][sizes="167x167"]',
          'href',
          `assets/themes/${themeName}/img/logo_apple_167x167.png`
        );
        this.trySetAttribute(
          'link[rel="apple-touch-icon"][sizes="180x180"]',
          'href',
          `assets/themes/${themeName}/img/logo_apple_180x180.png`
        );
        this.trySetAttribute('meta[name="theme-color"]', 'content', `#${themeColor}`);

        await this.loadCss(`${themeName}.css`);
      });
  }

  private async loadCss(filename: string) {
    const themePreloadLinkEl: HTMLElement = this.renderer.createElement('link');
    this.renderer.setAttribute(themePreloadLinkEl, 'rel', 'preload');
    this.renderer.setAttribute(themePreloadLinkEl, 'as', 'style');
    this.renderer.setAttribute(themePreloadLinkEl, 'href', filename);
    this.renderer.appendChild(this.head, themePreloadLinkEl);
    this.themePreloadLinks = [...this.themePreloadLinks, themePreloadLinkEl];

    // remove preload of previous theme
    if (this.themePreloadLinks.length === 2) {
      this.renderer.removeChild(this.head, this.themePreloadLinks.shift());
    }

    return new Promise(resolve => {
      const themeLinkEl: HTMLElement = this.renderer.createElement('link');
      this.renderer.setAttribute(themeLinkEl, 'rel', 'stylesheet');
      this.renderer.setAttribute(themeLinkEl, 'type', 'text/css');
      this.renderer.setAttribute(themeLinkEl, 'href', filename);
      this.renderer.setProperty(themeLinkEl, 'onload', resolve);
      this.renderer.appendChild(this.head, themeLinkEl);
      this.themeLinks = [...this.themeLinks, themeLinkEl];

      // remove style of previous theme
      if (this.themeLinks.length === 2) {
        this.renderer.removeChild(this.head, this.themeLinks.shift());
      }
    });
  }
}
