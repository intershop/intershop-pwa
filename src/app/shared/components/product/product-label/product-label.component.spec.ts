import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { ProductLabelComponent } from './product-label.component';

describe('Product Label Component', () => {
  let component: ProductLabelComponent;
  let fixture: ComponentFixture<ProductLabelComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    await TestBed.configureTestingModule({
      declarations: [ProductLabelComponent],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLabelComponent);
    element = fixture.nativeElement;
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should create HTML tag span when component is created', () => {
    when(context.select('label')).thenReturn(of('sale'));

    fixture.detectChanges();
    expect(element.querySelector('[class^="product-label product-label-sale"]')).not.toBeNull();
  });
});
