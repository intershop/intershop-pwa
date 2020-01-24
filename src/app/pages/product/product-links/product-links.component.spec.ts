import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { LARGE_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { ProductItemComponent } from 'ish-shared/components/product/product-item/product-item.component';

import { ProductLinksCarouselComponent } from '../product-links-carousel/product-links-carousel.component';
import { ProductLinksListComponent } from '../product-links-list/product-links-list.component';

import { ProductLinksComponent } from './product-links.component';

describe('Product Links Component', () => {
  let component: ProductLinksComponent;
  let fixture: ComponentFixture<ProductLinksComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), ngrxTesting({ reducers: coreReducers })],
      declarations: [
        MockComponent(ProductItemComponent),
        MockComponent(ProductLinksCarouselComponent),
        MockComponent(ProductLinksListComponent),
        ProductLinksComponent,
      ],
      providers: [{ provide: LARGE_BREAKPOINT_WIDTH, useValue: 992 }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLinksComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => component.ngOnChanges()).not.toThrow();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
