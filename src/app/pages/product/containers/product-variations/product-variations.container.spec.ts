import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';

import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { ProductVariationsContainerComponent } from './product-variations.container';

describe('Product Variations Container', () => {
  let component: ProductVariationsContainerComponent;
  let fixture: ComponentFixture<ProductVariationsContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'ish-product-variations',
          template: 'Product Variations Component',
          inputs: ['product', 'masterProduct', 'variations'],
        }),
        ProductVariationsContainerComponent,
      ],
      imports: [NgbModalModule, StoreModule.forRoot({})],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductVariationsContainerComponent);
    component = fixture.componentInstance;
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
