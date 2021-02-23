import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { ProductIdComponent } from './product-id.component';

describe('Product Id Component', () => {
  let component: ProductIdComponent;
  let fixture: ComponentFixture<ProductIdComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.select('displayProperties', 'sku')).thenReturn(of(true));

    await TestBed.configureTestingModule({
      declarations: [ProductIdComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductIdComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display id for given product id', () => {
    when(context.select('product', 'sku')).thenReturn(of('test-sku'));
    fixture.detectChanges();
    expect(element.querySelector('.product-id').textContent).toContain('test-sku');
  });
});
