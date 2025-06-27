import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import { Meta, MetaDefinition } from '@angular/platform-browser';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, delay, filter, firstValueFrom, map, of, race } from 'rxjs';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { CategoryHelper } from 'ish-core/models/category/category.helper';
import { REQUEST } from 'ish-core/models/express-tokens/express.tokens';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.helper';
import { SeoAttributes } from 'ish-core/models/seo-attributes/seo-attributes.model';
import { generateCategoryUrl, ofCategoryUrl } from 'ish-core/routing/category/category.route';
import { generateProductUrl, ofProductUrl } from 'ish-core/routing/product/product.route';
import { getSelectedCategory } from 'ish-core/store/shopping/categories';
import { getSelectedProduct } from 'ish-core/store/shopping/products';
import { DomService } from 'ish-core/utils/dom/dom.service';
import { InjectSingle } from 'ish-core/utils/injection';

@Injectable({ providedIn: 'root' })
export class SeoService {
  pageTitle$ = new Subject<string>();
  pageDescription$ = new Subject<string>();

  constructor(
    private domService: DomService,
    private metaService: Meta,
    private translate: TranslateService,
    @Inject(DOCUMENT) private doc: Document,
    @Optional() @Inject(REQUEST) private request: InjectSingle<typeof REQUEST>,
    @Inject(APP_BASE_HREF) private baseHref: string,
    private store: Store
  ) {}

  private productPage$ = this.store.pipe(
    ofProductUrl(),
    select(getSelectedProduct),
    filter(p => ProductHelper.isSufficientlyLoaded(p, ProductCompletenessLevel.Detail)),
    filter(p => !ProductHelper.isFailedLoading(p))
  );

  private categoryPage$ = this.store.pipe(
    ofCategoryUrl(),
    select(getSelectedCategory),
    filter(CategoryHelper.isCategoryCompletelyLoaded)
  );

  private baseURL(): string {
    let url: string;

    if (!!SSR && this.request) {
      url = `${this.request.protocol}://${this.request.get('host')}${this.baseHref}`;
    } else if (!SSR) {
      url = this.doc.baseURI;
    } else {
      url = this.baseHref;
    }
    return url.endsWith('/') ? url : `${url}/`;
  }

  setCanonicalLink(url: string) {
    // the canonical URL of a production system should always be with 'https:'
    // even though the PWA SSR container itself is usually not deployed in an SSL environment so the URLs need manual adaption

    const canonicalUrl = encodeURI(url.replace('http:', 'https:'));

    const canonicalLink = this.domService.getOrCreateElement('link[rel="canonical"]', 'link', this.doc.head);

    this.domService.setAttribute(canonicalLink, 'rel', 'canonical');
    this.domService.setAttribute(canonicalLink, 'href', canonicalUrl);

    this.addOrModifyTag({ property: 'og:url', content: canonicalUrl });
  }

  setSeoAttributes(seoAttributes: SeoAttributes) {
    Object.entries(seoAttributes)
      .filter(([, v]) => !!v)
      .forEach(([key, value]) => {
        switch (key) {
          case 'title':
            this.pageTitle$.next(value);
            return;
          case 'description':
            this.pageDescription$.next(value);
            return;
          case 'robots':
            this.addOrModifyTag({ name: key, content: value });
            return;
        }
        this.addOrModifyTag({ property: key.startsWith('og:') ? key : `og:${key}`, content: value });
      });
    this.addOrModifyTag({ property: 'pwa-version', content: PWA_VERSION });
  }

  addOrModifyTag(tag: MetaDefinition) {
    if (!this.metaService.updateTag(tag)) {
      this.metaService.addTag(tag);
    }
  }

  // Adapt the page title for specific pages
  enhancePageTitle(title: string, path: string): string {
    let pageSuffix = '';
    if (path?.startsWith('account/')) {
      pageSuffix = `${this.translate.instant('account.my_account.heading')}`;
    }
    if (path?.startsWith('checkout/')) {
      pageSuffix = `${this.translate.instant('seo.title.checkout')}`;
    }
    return pageSuffix && pageSuffix !== title ? `${title} - ${pageSuffix}` : title;
  }

  resolveCanonicalUrl(): Observable<string> {
    return race([
      this.productPage$.pipe(map(product => this.baseURL() + generateProductUrl(product).substring(1))),
      this.categoryPage$.pipe(
        map((category: CategoryView) => this.baseURL() + generateCategoryUrl(category).substring(1))
      ),
      of(this.doc.URL.replace(/[;?].*/g, '')).pipe(delay(0)),
    ]);
  }

  async resolveAndSetCanonicalUrl(): Promise<string> {
    const url = await firstValueFrom(this.resolveCanonicalUrl());
    this.setCanonicalLink(url);
    return url;
  }
}
