import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

import { ProductListComponent } from './product-list.component';

describe('Product List Component', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(LoadingComponent),
        MockComponent(ProductItemComponent),
        MockDirective(ProductContextDirective),
        ProductListComponent,
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.products = ['sku'];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render a product tile when viewType is grid', () => {
    component.viewType = 'grid';
    fixture.detectChanges();
    const productItemContainer = fixture.debugElement.query(By.css('ish-product-item'))
      .componentInstance as ProductItemComponent;
    expect(productItemContainer.displayType).toEqual('tile');
  });

  it('should render a product row when viewType is list', () => {
    component.viewType = 'list';
    fixture.detectChanges();
    const productItemContainer = fixture.debugElement.query(By.css('ish-product-item'))
      .componentInstance as ProductItemComponent;
    expect(productItemContainer.displayType).toEqual('row');
  });

  it('should display loading when product list is loading', fakeAsync(() => {
    component.products = [];
    when(shoppingFacade.productListingLoading$).thenReturn(of(true));

    fixture.detectChanges();

    expect(findAllCustomElements(element)).toEqual(['ish-loading', 'ish-loading']);
  }));
});
