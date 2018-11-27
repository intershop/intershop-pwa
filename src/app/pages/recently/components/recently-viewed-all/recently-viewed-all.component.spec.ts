import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { Product } from 'ish-core/models/product/product.model';
import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { RecentlyViewedAllComponent } from './recently-viewed-all.component';

describe('Recently Viewed All Component', () => {
  let component: RecentlyViewedAllComponent;
  let fixture: ComponentFixture<RecentlyViewedAllComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'ish-product-tile-container',
          template: 'Product Tile Container',
          inputs: ['productSku'],
        }),
        MockComponent({ selector: 'ish-loading', template: 'Loading Component' }),
        RecentlyViewedAllComponent,
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentlyViewedAllComponent);
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
