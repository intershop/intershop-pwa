import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';

import { QuickorderRepeatFormQuantityComponent } from './quickorder-repeat-form-quantity.component';

describe('Quickorder Repeat Form Quantity Component', () => {
  let component: QuickorderRepeatFormQuantityComponent;
  let fixture: ComponentFixture<QuickorderRepeatFormQuantityComponent>;
  let element: HTMLElement;
  const context = mock(ProductContextFacade);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent(ProductQuantityComponent), QuickorderRepeatFormQuantityComponent],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    when(context.select('quantity')).thenReturn(of(1));
    fixture = TestBed.createComponent(QuickorderRepeatFormQuantityComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.skuControl = new FormControl('');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
