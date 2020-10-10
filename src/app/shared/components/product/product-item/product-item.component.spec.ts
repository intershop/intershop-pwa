import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ProductRowComponent } from 'ish-shared/components/product/product-row/product-row.component';
import { ProductTileComponent } from 'ish-shared/components/product/product-tile/product-tile.component';

import { ProductItemComponent } from './product-item.component';

describe('Product Item Component', () => {
  let component: ProductItemComponent;
  let fixture: ComponentFixture<ProductItemComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(LoadingComponent),
        MockComponent(ProductRowComponent),
        MockComponent(ProductTileComponent),
        ProductItemComponent,
      ],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(mock(ProductContextFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductItemComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
