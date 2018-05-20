import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { instance, mock } from 'ts-mockito/lib/ts-mockito';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { ProductCompareStatusContainerComponent } from './product-compare-status.container';

describe('Product Compare Status Container', () => {
  let component: ProductCompareStatusContainerComponent;
  let fixture: ComponentFixture<ProductCompareStatusContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'ish-product-compare-status',
          template: 'Compare Status',
          inputs: ['productCompareCount'],
        }),
        ProductCompareStatusContainerComponent,
      ],
      providers: [{ provide: Store, useFactory: () => instance(mock(Store)) }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ProductCompareStatusContainerComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
