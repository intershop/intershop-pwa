import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { Product } from 'ish-core/models/product/product.model';
import { MockComponent } from 'ish-core/utils/dev/mock.component';

import { RecentlyViewedComponent } from './recently-viewed.component';

describe('Recently Viewed Component', () => {
  let component: RecentlyViewedComponent;
  let fixture: ComponentFixture<RecentlyViewedComponent>;
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
