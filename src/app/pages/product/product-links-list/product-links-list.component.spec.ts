import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductLinks } from 'ish-core/models/product-links/product-links.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

import { ProductLinksListComponent } from './product-links-list.component';

describe('Product Links List Component', () => {
  let component: ProductLinksListComponent;
  let fixture: ComponentFixture<ProductLinksListComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      declarations: [MockDirective(ProductContextDirective), ProductLinksListComponent],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    const productLink = { products: ['sku1', 'sku2', 'sku3'], categories: ['catID'] } as ProductLinks;

    fixture = TestBed.createComponent(ProductLinksListComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.links = productLink;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element.querySelector('.product-list')).toBeTruthy();
  });

  it('should render all product slides if stocks filtering is off', () => {
    component.displayOnlyAvailableProducts = false;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelectorAll('ish-product-item')).toHaveLength(3);
  });

  it('should render only available products  if stocks filtering is on', () => {
    when(shoppingFacade.product$(anything(), anything())).thenCall(sku =>
      of({ sku, available: sku !== 'sku2' } as ProductView)
    );

    component.displayOnlyAvailableProducts = true;
    component.ngOnChanges();
    fixture.detectChanges();

    expect(element.querySelectorAll('ish-product-item')).toHaveLength(2);
  });
});
