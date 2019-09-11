import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule, combineReducers } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { LoadingComponent } from 'ish-shared/common/components/loading/loading.component';
import { ProductRowComponent } from 'ish-shared/product/components/product-row/product-row.component';
import { ProductTileComponent } from 'ish-shared/product/components/product-tile/product-tile.component';

import { ProductItemContainerComponent } from './product-item.container';

describe('Product Item Container', () => {
  let component: ProductItemContainerComponent;
  let fixture: ComponentFixture<ProductItemContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModalModule,
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
        }),
      ],
      declarations: [
        MockComponent(LoadingComponent),
        MockComponent(ProductRowComponent),
        MockComponent(ProductTileComponent),
        ProductItemContainerComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductItemContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.productSku = 'sku';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
