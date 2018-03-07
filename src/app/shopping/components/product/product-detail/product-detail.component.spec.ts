import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Product } from '../../../../models/product/product.model';
import { ProductDetailComponent } from './product-detail.component';


describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    const prod = new Product('sku');

    TestBed.configureTestingModule({
      declarations: [ProductDetailComponent],
      imports: [
        TranslateModule.forRoot()
      ],
      // TODO: prepare more detailed test
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(ProductDetailComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      component.product = prod;
    });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });
});
