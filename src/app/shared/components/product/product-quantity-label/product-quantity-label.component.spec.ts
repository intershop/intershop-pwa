import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

import { ProductQuantityLabelComponent } from './product-quantity-label.component';

describe('Product Quantity Label Component', () => {
  let component: ProductQuantityLabelComponent;
  let fixture: ComponentFixture<ProductQuantityLabelComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ProductQuantityLabelComponent],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(mock(ProductContextFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductQuantityLabelComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
