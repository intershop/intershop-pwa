import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';

import { Product } from 'ish-core/models/product/product.model';
import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { ProductRowContainerComponent } from './product-row.container';

describe('Product Row Container', () => {
  let component: ProductRowContainerComponent;
  let fixture: ComponentFixture<ProductRowContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'ish-product-row',
          template: 'Product Row Component',
          inputs: ['product', 'category', 'isInCompareList'],
        }),
        ProductRowContainerComponent,
      ],
      imports: [NgbModalModule, StoreModule.forRoot({})],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRowContainerComponent);
    component = fixture.componentInstance;
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.product = { sku: 'sku' } as Product;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
