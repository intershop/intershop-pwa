import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockDirective } from 'ng-mocks';
import { EMPTY, of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductNameComponent } from 'ish-shared/components/product/product-name/product-name.component';

import { ProductBundleDisplayComponent } from './product-bundle-display.component';

describe('Product Bundle Display Component', () => {
  let component: ProductBundleDisplayComponent;
  let fixture: ComponentFixture<ProductBundleDisplayComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.select('parts')).thenReturn(EMPTY);
    when(context.select('displayProperties', 'bundleParts')).thenReturn(of(true));

    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(ProductNameComponent),
        MockDirective(ProductContextDirective),
        ProductBundleDisplayComponent,
      ],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBundleDisplayComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render product bundle parts when supplied', () => {
    when(context.select('parts')).thenReturn(
      of([
        { sku: 'ABC', quantity: 3 },
        { sku: 'DEF', quantity: 2 },
      ])
    );
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <ul>
        <li>
          3 x
          <ish-product-name
            ishproductcontext=""
            ng-reflect-link="false"
            ng-reflect-sku="ABC"
          ></ish-product-name>
        </li>
        <li>
          2 x
          <ish-product-name
            ishproductcontext=""
            ng-reflect-link="false"
            ng-reflect-sku="DEF"
          ></ish-product-name>
        </li>
      </ul>
    `);
  });
});
