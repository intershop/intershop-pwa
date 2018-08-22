import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';

import { MockComponent } from '../../../utils/dev/mock.component';

import { ProductRowContainerComponent } from './product-row.container';

describe('Product Row Container', () => {
  let component: ProductRowContainerComponent;
  let fixture: ComponentFixture<ProductRowContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProductRowContainerComponent,
        MockComponent({
          selector: 'ish-product-row',
          template: 'Product Row Component',
          inputs: ['product', 'category'],
        }),
      ],
      imports: [StoreModule.forRoot({}), NgbModalModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRowContainerComponent);
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
