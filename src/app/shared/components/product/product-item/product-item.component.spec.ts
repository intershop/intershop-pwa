import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ProductRowComponent } from 'ish-shared/components/product/product-row/product-row.component';
import { ProductTileComponent } from 'ish-shared/components/product/product-tile/product-tile.component';

import { ProductItemComponent } from './product-item.component';

describe('Product Item Component', () => {
  let component: ProductItemComponent;
  let fixture: ComponentFixture<ProductItemComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.select('product')).thenReturn(of({}));

    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(LoadingComponent),
        MockComponent(ProductRowComponent),
        MockComponent(ProductTileComponent),
        ProductItemComponent,
      ],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
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

  it('should display tile by default', () => {
    fixture.detectChanges();

    expect(findAllCustomElements(element)).toEqual(['ish-product-tile']);
  });

  it('should display row when selected', () => {
    component.displayType = 'row';
    fixture.detectChanges();

    expect(findAllCustomElements(element)).toEqual(['ish-product-row']);
  });

  it('should display loading overlay when loading', () => {
    when(context.select('loading')).thenReturn(of(true));
    fixture.detectChanges();

    expect(findAllCustomElements(element)).toInclude('ish-loading');
  });
});
