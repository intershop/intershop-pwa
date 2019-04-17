import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ProductCompareStatusComponent } from '../../components/product-compare-status/product-compare-status.component';

import { ProductCompareStatusContainerComponent } from './product-compare-status.container';

describe('Product Compare Status Container', () => {
  let component: ProductCompareStatusContainerComponent;
  let fixture: ComponentFixture<ProductCompareStatusContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(ProductCompareStatusComponent), ProductCompareStatusContainerComponent],
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
