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

  private iconLink: HTMLLinkElement;
  private webmanifestLink: HTMLLinkElement;
  private appleTouchIconLink: HTMLLinkElement;
  private appleTouchIcon152x152Link: HTMLLinkElement;
  private appleTouchIcon167x167Link: HTMLLinkElement;
  private appleTouchIcon180x180Link: HTMLLinkElement;
  private themeColor: HTMLMetaElement;

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
    private store: Store
  ) {
    this.head = this.document.head;
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);

    this.iconLink = this.document.querySelector('link[rel="icon"]');
    this.webmanifestLink = this.document.querySelector('link[rel="manifest"]');
    this.appleTouchIconLink = this.document.querySelector('link[rel="apple-touch-icon"]:not([sizes])');
    this.appleTouchIcon152x152Link = this.document.querySelector('link[rel="apple-touch-icon"][sizes="152x152"]');
    this.appleTouchIcon167x167Link = this.document.querySelector('link[rel="apple-touch-icon"][sizes="167x167"]');
    this.appleTouchIcon180x180Link = this.document.querySelector('link[rel="apple-touch-icon"][sizes="180x180"]');
    this.themeColor = this.document.querySelector('meta[name="theme-color"]');
  }

  init() {
    this.store
      .pipe(select(getTheme))
      .pipe(
        distinctUntilChanged(),
        filter(x => !!x)
      )
      .subscribe(async theme => {
        const themeData = theme.split('|');
        const themeName = themeData[0];
        const themeColor = themeData[1];

        this.iconLink.setAttribute('href', `assets/themes/${themeName}/img/favicon.ico`);
        this.webmanifestLink.setAttribute('href', `assets/themes/${themeName}/manifest.webmanifest`);
        this.appleTouchIconLink.setAttribute('href', `assets/themes/${themeName}/img/logo_apple_120x120.png`);
        this.appleTouchIcon152x152Link.setAttribute('href', `assets/themes/${themeName}/img/logo_apple_152x152.png`);
        this.appleTouchIcon167x167Link.setAttribute('href', `assets/themes/${themeName}/img/logo_apple_167x167.png`);
        this.appleTouchIcon180x180Link.setAttribute('href', `assets/themes/${themeName}/img/logo_apple_180x180.png`);

        if (themeColor) {
          this.themeColor.setAttribute('content', `#${themeColor}`);
        }

        await this.loadCss(`${themeName}.css`);
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

      // remove style of previous theme
      if (this.themeLinks.length === 2) {
        this.renderer.removeChild(this.head, this.themeLinks.shift());
      }
    });
  }
}
