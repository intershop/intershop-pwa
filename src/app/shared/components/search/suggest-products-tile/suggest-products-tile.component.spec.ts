import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { ProductImageComponent } from 'ish-shared/components/product/product-image/product-image.component';

import { SuggestProductsTileComponent } from './suggest-products-tile.component';

describe('Suggest Products Tile Component', () => {
  let component: SuggestProductsTileComponent;
  let fixture: ComponentFixture<SuggestProductsTileComponent>;
  let element: HTMLElement;

  const productName = 'Product 12 345 (very long so it will be truncated)';
  const productName41 = 'Product 12 345 (excactly "41" characters)';
  const productURL = '/product-12-345-prd12345';

  const context = mock(ProductContextFacade);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [MockComponent(ProductImageComponent), SuggestProductsTileComponent],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();

    when(context.select('productURL')).thenReturn(of(productURL));
    when(context.select('product', 'name')).thenReturn(of(productName));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestProductsTileComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display relevent product tile elements', () => {
    fixture.detectChanges();

    const keywordElements = element.querySelectorAll('a');
    expect(keywordElements).toHaveLength(2);
    expect(keywordElements[0].attributes.getNamedItem('href').value).toEqual(productURL);
    expect(keywordElements[1].attributes.getNamedItem('href').value).toEqual(productURL);
    expect(keywordElements[1].textContent).toMatchInlineSnapshot(
      `"Product 12 345 (very long so it will be truncated)"`
    );
    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      [
        "ish-product-image",
      ]
    `);
  });

  it('should display product name for desktop truncated', () => {
    component.deviceType = 'desktop';
    fixture.detectChanges();

    const keywordElements = element.querySelectorAll('a');
    expect(keywordElements[1].textContent).toMatchInlineSnapshot(`"Product 12 345 (very long so it will b..."`);
  });

  it('should display product name for desktop truncated', () => {
    when(context.select('product', 'name')).thenReturn(of(productName41));
    component.deviceType = 'desktop';
    fixture.detectChanges();

    const keywordElements = element.querySelectorAll('a');
    expect(keywordElements[1].textContent).toMatchInlineSnapshot(`"Product 12 345 (excactly "41" characters)"`);
  });
});
