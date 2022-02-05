import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductAttachmentsComponent } from 'ish-shared/components/product/product-attachments/product-attachments.component';
import { ProductAttributesComponent } from 'ish-shared/components/product/product-attributes/product-attributes.component';
import { ProductShipmentComponent } from 'ish-shared/components/product/product-shipment/product-shipment.component';

import { ProductDetailInfoComponent } from './product-detail-info.component';

describe('Product Detail Info Component', () => {
  let component: ProductDetailInfoComponent;
  let fixture: ComponentFixture<ProductDetailInfoComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbNavModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(ProductAttachmentsComponent),
        MockComponent(ProductAttributesComponent),
        MockComponent(ProductShipmentComponent),
        ProductDetailInfoComponent,
      ],
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
