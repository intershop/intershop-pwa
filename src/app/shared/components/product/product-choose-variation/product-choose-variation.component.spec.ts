import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { ProductChooseVariationComponent } from './product-choose-variation.component';

describe('Product Choose Variation Component', () => {
  let component: ProductChooseVariationComponent;
  let fixture: ComponentFixture<ProductChooseVariationComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const context = mock(ProductContextFacade);
    when(context.select('variationCount')).thenReturn(of(5));
    when(context.select('productURL')).thenReturn(of('/product/MASTER'));

    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [ProductChooseVariationComponent],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductChooseVariationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render link to product when variations are available', () => {
    fixture.detectChanges();

    expect(element.querySelector('a')?.href).toMatchInlineSnapshot(`"http://localhost/product/MASTER"`);
  });
});
