import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

import { RecentlyViewedAllComponent } from './recently-viewed-all.component';

describe('Recently Viewed All Component', () => {
  let component: RecentlyViewedAllComponent;
  let fixture: ComponentFixture<RecentlyViewedAllComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MockComponent(ProductItemComponent),
        MockDirective(ProductContextDirective),
        RecentlyViewedAllComponent,
      ],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentlyViewedAllComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.products = ['sku'];
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
