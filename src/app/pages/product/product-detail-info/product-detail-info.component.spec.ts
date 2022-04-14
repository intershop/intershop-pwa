import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { ProductDetailInfoComponent } from './product-detail-info.component';

describe('Product Detail Info Component', () => {
  let component: ProductDetailInfoComponent;
  let fixture: ComponentFixture<ProductDetailInfoComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductDetailInfoComponent],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(mock(ProductContextFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailInfoComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
