import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { REQUEST } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { getSelectedProduct } from 'ish-core/store/shopping/products';
import { routerTestNavigatedAction } from 'ish-core/utils/dev/routing';

import { SeoEffects } from './seo.effects';

describe('Seo Effects', () => {
  it.each([
    { requestUrl: 'https://shop.example.com/prd123', baseHref: '/', expectedBase: 'https://shop.example.com/' },
    {
      requestUrl: 'http://shop.example.com:4200/prd123;lang=en_US?campaign=test',
      baseHref: '/store/en',
      expectedBase: 'https://shop.example.com:4200/store/en/',
    },
    {
      requestUrl: 'https://shop.example.com/prd123',
      baseHref: '/store/en/',
      expectedBase: 'https://shop.example.com/store/en/',
    },
    { requestUrl: undefined, baseHref: '/', expectedBase: 'https://browser.example.com/shop/' },
  ])('should generate canonical links using $expectedBase', async ({ requestUrl, baseHref, expectedBase }) => {
    const doc = document.implementation.createHTMLDocument();
    const base = doc.createElement('base');
    base.href = 'https://browser.example.com/shop/';
    doc.head.appendChild(base);

    const request = mock<Request>();
    when(request.url).thenReturn(requestUrl);

    TestBed.configureTestingModule({
      providers: [
        { provide: APP_BASE_HREF, useValue: baseHref },
        { provide: DOCUMENT, useValue: doc },
        { provide: REQUEST, useValue: requestUrl ? instance(request) : undefined },
        { provide: TranslateService, useFactory: () => instance(mock(TranslateService)) },
        provideMockActions(() => of(routerTestNavigatedAction({}))),
        provideMockStore({
          initialState: { router: { state: { params: { sku: '123' } } } },
          selectors: [
            {
              selector: getSelectedProduct,
              value: { sku: '123', name: 'Camera', completenessLevel: ProductCompletenessLevel.Detail },
            },
          ],
        }),
        SeoEffects,
      ],
    });

    await firstValueFrom(TestBed.inject(SeoEffects).seoCanonicalLink$);

    const expectedUrl = `${expectedBase}camera-prd123`;
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute('href')).toEqual(expectedUrl);
    expect(doc.querySelector('meta[property="og:url"]')?.getAttribute('content')).toEqual(expectedUrl);
  });
});
