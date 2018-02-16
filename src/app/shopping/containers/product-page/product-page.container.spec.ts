import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductPageContainerComponent } from './product-page.container';

describe('Product Page Container', () => {
  let component: ProductPageContainerComponent;
  let fixture: ComponentFixture<ProductPageContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductPageContainerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TODO: test needs adaption to work with product resolver
  xit('should be created', () => {
    expect(component).toBeTruthy();
  });
});
