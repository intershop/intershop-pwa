import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';

import { LineItemExtendedContentEditComponent } from './line-item-extended-content-edit.component';

describe('Line Item Extended Content Edit Component', () => {
  let component: LineItemExtendedContentEditComponent;
  let fixture: ComponentFixture<LineItemExtendedContentEditComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LineItemExtendedContentEditComponent],
      providers: [
        { provide: CheckoutFacade, useFactory: () => instance(mock(CheckoutFacade)) },
        { provide: FeatureToggleService, useFactory: () => instance(mock(FeatureToggleService)) },
        { provide: ProductContextFacade, useFactory: () => instance(mock(ProductContextFacade)) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemExtendedContentEditComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
