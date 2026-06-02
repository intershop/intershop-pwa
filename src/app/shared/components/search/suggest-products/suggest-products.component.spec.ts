import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { ReplaySubject, of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { AppFacade } from 'ish-core/facades/app.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { ProductInventory } from 'ish-core/models/product-inventory/product-inventory.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { SuggestProductsTileComponent } from 'ish-shared/components/search/suggest-products-tile/suggest-products-tile.component';

import { SuggestProductsComponent } from './suggest-products.component';

describe('Suggest Products Component', () => {
  let component: SuggestProductsComponent;
  let fixture: ComponentFixture<SuggestProductsComponent>;
  let element: HTMLElement;
  let appFacade: AppFacade;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    appFacade = mock(AppFacade);
    shoppingFacade = mock(ShoppingFacade);

    when(appFacade.serverSetting$<number>(anything())).thenReturn(of(10));
    when(shoppingFacade.category$(anything())).thenReturn(of({} as CategoryView));
    when(shoppingFacade.product$(anything(), anything())).thenReturn(of({} as ProductView));
    when(shoppingFacade.productInventory$(anything())).thenReturn(of({} as ProductInventory));

    await TestBed.configureTestingModule({
      imports: [SuggestProductsComponent, TranslateModule.forRoot()],
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) },
      ],
    })
      .overrideComponent(SuggestProductsComponent, {
        remove: {
          imports: [ProductContextDirective, SuggestProductsTileComponent],
        },
        add: {
          imports: [MockDirective(ProductContextDirective), MockComponent(SuggestProductsTileComponent)],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestProductsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.products = ['12345', '67890'];
    component.maxAutoSuggests = 2;
    component.inputTerms$ = new ReplaySubject<string>(1);
    component.inputTerms$.next('cat');
    component.deviceType = 'desktop';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display headline text', () => {
    fixture.detectChanges();
    const headline = element.querySelector('.headline');
    expect(headline).toBeTruthy();
    expect(headline.textContent.trim()).toBe('suggest.products.headline');
  });

  it('should display the correct number (maxAutoSuggests = 2) of product suggestions', () => {
    fixture.detectChanges();
    // should contain custom elements for product tiles
    expect(findAllCustomElements(element)).toContain('ish-suggest-products-tile');
    expect(element.querySelectorAll('ish-suggest-products-tile')).toHaveLength(2);
  });

  it('should limit displayed products to maxAutoSuggests', () => {
    // set more products than maxAutoSuggests
    component.products = ['12345', '67890', '98765', '43210'];
    component.maxAutoSuggests = 3;
    fixture.detectChanges();

    // should only show the first 3 despite having 4 products
    expect(element.querySelectorAll('ish-suggest-products-tile')).toHaveLength(3);
  });

  it('should show fewer products when products array is smaller than maxAutoSuggests', () => {
    component.products = ['12345'];
    component.maxAutoSuggests = 5;
    fixture.detectChanges();

    expect(element.querySelectorAll('ish-suggest-products-tile')).toHaveLength(1);
  });

  it('should handle undefined maxAutoSuggests by showing all products', () => {
    component.products = ['12345', '67890', '98765'];
    component.maxAutoSuggests = undefined;
    fixture.detectChanges();

    // without maxAutoSuggests limit, all products should be displayed
    expect(element.querySelectorAll('ish-suggest-products-tile')).toHaveLength(3);
  });
});
