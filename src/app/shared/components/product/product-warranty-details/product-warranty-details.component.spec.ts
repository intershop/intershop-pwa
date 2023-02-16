import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Warranty } from 'ish-core/models/warranty/warranty.model';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { ModalDialogLinkComponent } from 'ish-shared/components/common/modal-dialog-link/modal-dialog-link.component';

import { ProductWarrantyDetailsComponent } from './product-warranty-details.component';

describe('Product Warranty Details Component', () => {
  let component: ProductWarrantyDetailsComponent;
  let fixture: ComponentFixture<ProductWarrantyDetailsComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);
    when(shoppingFacade.warrantyById$(anything())).thenReturn(of({ id: 'war1' } as Warranty));

    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(ErrorMessageComponent),
        MockComponent(ModalDialogLinkComponent),
        ProductWarrantyDetailsComponent,
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductWarrantyDetailsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.warranty = { id: 'war1' } as Warranty;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
