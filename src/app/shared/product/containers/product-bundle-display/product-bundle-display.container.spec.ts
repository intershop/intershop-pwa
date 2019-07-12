import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { ProductBundleDisplayComponent } from '../../components/product-bundle-display/product-bundle-display.component';

import { ProductBundleDisplayContainerComponent } from './product-bundle-display.container';

describe('Product Bundle Display Container', () => {
  let component: ProductBundleDisplayContainerComponent;
  let fixture: ComponentFixture<ProductBundleDisplayContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      declarations: [MockComponent(ProductBundleDisplayComponent), ProductBundleDisplayContainerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBundleDisplayContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
