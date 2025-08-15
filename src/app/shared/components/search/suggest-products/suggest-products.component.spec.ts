import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { ReplaySubject } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { getServerConfig } from 'ish-core/store/core/server-config';
import { getShoppingState } from 'ish-core/store/shopping/shopping-store';
import { SuggestProductsTileComponent } from 'ish-shared/components/search/suggest-products-tile/suggest-products-tile.component';

import { SuggestProductsComponent } from './suggest-products.component';

describe('Suggest Products Component', () => {
  let component: SuggestProductsComponent;
  let fixture: ComponentFixture<SuggestProductsComponent>;
  let element: HTMLElement;

  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.set(anything)).thenReturn(undefined);
    await TestBed.configureTestingModule({
      imports: [MockComponent(SuggestProductsTileComponent), SuggestProductsComponent, TranslateModule.forRoot()],
      providers: [
        { provide: ProductContextFacade, useFactory: () => instance(context) },
        provideMockStore({
          selectors: [
            { selector: getServerConfig, value: '' },
            {
              selector: getShoppingState,
              value: {
                categories: {},
                products: {
                  failed: [],
                  entities: {},
                  defaultVariation: {},
                },
              },
            },
          ],
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestProductsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.products = ['12345', '67890'];
    component.maxAutoSuggests = 2;
    component.inputTerms$ = new ReplaySubject<string>(1);
    component.inputTerms$.next('cat');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the correct number of product suggestions', () => {
    fixture.detectChanges();
    expect(element.querySelectorAll('ish-suggest-products-tile')).toHaveLength(2);
  });

  it('should pass correct products to suggest-products-tile components', () => {
    fixture.detectChanges();
    const tileComponents = element.querySelectorAll('ish-suggest-products-tile');
    expect(tileComponents[0].getAttribute('ng-reflect-sku')).toBe('12345');
    expect(tileComponents[1].getAttribute('ng-reflect-sku')).toBe('67890');
  });
});
