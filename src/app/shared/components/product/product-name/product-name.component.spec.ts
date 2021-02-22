import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { ProductNameComponent } from './product-name.component';

describe('Product Name Component', () => {
  let component: ProductNameComponent;
  let fixture: ComponentFixture<ProductNameComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.select('displayProperties', 'name')).thenReturn(of(true));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ProductNameComponent],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductNameComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render nothing when product not available', () => {
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`N/A`);
  });

  describe('with product', () => {
    beforeEach(() => {
      when(context.select('product', 'name')).thenReturn(of('TEST'));
      when(context.select('productURL')).thenReturn(of('/product/TEST'));
    });

    it('should always render name with link by default', () => {
      fixture.detectChanges();

      expect(element.querySelector('a[data-testing-id="product-name-link"]')).toBeTruthy();
      expect(element.textContent).toMatchInlineSnapshot(`"TEST"`);
    });

    it('should render just name when link is false', () => {
      component.link = false;
      fixture.detectChanges();

      expect(element).toMatchInlineSnapshot(`TEST`);
    });

    it('should render alternate when supplied', () => {
      component.alternate = 'ALT';
      fixture.detectChanges();

      expect(element.textContent).toMatchInlineSnapshot(`"ALT"`);
    });
  });
});
