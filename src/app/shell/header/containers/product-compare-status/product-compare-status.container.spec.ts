import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { combineReducers } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { ProductCompareStatusComponent } from 'ish-shell/header/components/product-compare-status/product-compare-status.component';

import { ProductCompareStatusContainerComponent } from './product-compare-status.container';

describe('Product Compare Status Container', () => {
  let component: ProductCompareStatusContainerComponent;
  let fixture: ComponentFixture<ProductCompareStatusContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent(ProductCompareStatusComponent), ProductCompareStatusContainerComponent],
      imports: [ngrxTesting({ reducers: { shopping: combineReducers(shoppingReducers) } })],
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
