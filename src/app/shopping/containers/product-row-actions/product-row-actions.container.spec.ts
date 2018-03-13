import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from '../../../utils/dev/mock.component';
import { ProductRowActionsContainerComponent } from './product-row-actions.container';

describe('Product Row Actions Container', () => {
  let component: ProductRowActionsContainerComponent;
  let fixture: ComponentFixture<ProductRowActionsContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProductRowActionsContainerComponent,
        MockComponent({ selector: 'ish-product-row-actions', template: 'Product Row Actions Component' }),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductRowActionsContainerComponent);
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
