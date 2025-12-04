import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { CompareFacade } from '../../facades/compare.facade';

import { ProductSendToCompareComponent } from './product-send-to-compare.component';

describe('Product Send To Compare Component', () => {
  let component: ProductSendToCompareComponent;
  let fixture: ComponentFixture<ProductSendToCompareComponent>;
  let element: HTMLElement;
  let compareFacade: CompareFacade;

  beforeEach(async () => {
    const context = mock(ProductContextFacade);
    when(context.get('sku')).thenReturn('1234');

    compareFacade = mock(CompareFacade);

    await TestBed.configureTestingModule({
      imports: [ProductSendToCompareComponent, TranslateModule.forRoot()],
      providers: [
        { provide: CompareFacade, useFactory: () => instance(compareFacade) },
        { provide: ProductContextFacade, useFactory: () => instance(context) },
        provideRouter([]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSendToCompareComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should emit "product to compare" event when compare link is clicked', () => {
    fixture.detectChanges();

    element.querySelector('a').click();

    verify(compareFacade.addProductToCompare(anything())).once();
    const [sku] = capture(compareFacade.addProductToCompare).last();
    expect(sku).toMatchInlineSnapshot(`"1234"`);
  });
});
