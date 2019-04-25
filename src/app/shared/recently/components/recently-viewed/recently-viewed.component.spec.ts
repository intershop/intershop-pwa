import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { Product } from 'ish-core/models/product/product.model';
import { LoadingComponent } from '../../../../shared/common/components/loading/loading.component';
import { ProductItemContainerComponent } from '../../../../shared/product/containers/product-item/product-item.container';

import { RecentlyViewedComponent } from './recently-viewed.component';

describe('Recently Viewed Component', () => {
  let component: RecentlyViewedComponent;
  let fixture: ComponentFixture<RecentlyViewedComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(LoadingComponent),
        MockComponent(ProductItemContainerComponent),
        RecentlyViewedComponent,
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentlyViewedComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.products = [{ sku: 'sku' } as Product];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
