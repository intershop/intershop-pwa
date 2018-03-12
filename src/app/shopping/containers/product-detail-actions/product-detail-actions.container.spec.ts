import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { combineReducers, StoreModule } from '@ngrx/store';
import { Product } from '../../../models/product/product.model';
import { MockComponent } from '../../../utils/dev/mock.component';
import { shoppingReducers } from '../../store/shopping.system';
import { ProductDetailActionsContainerComponent } from './product-detail-actions.container';

describe('Product Detail Actions Container Component', () => {
  let component: ProductDetailActionsContainerComponent;
  let fixture: ComponentFixture<ProductDetailActionsContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers)
        })
      ],
      declarations: [ProductDetailActionsContainerComponent,
        MockComponent({ selector: 'ish-product-detail-actions', template: 'Product Row Actions Component', inputs: ['product'] }),
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailActionsContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.product = new Product('SKU');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });
});
