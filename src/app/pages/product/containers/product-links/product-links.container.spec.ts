import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { LARGE_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { coreReducers } from 'ish-core/store/core-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { ProductItemContainerComponent } from 'ish-shared/product/containers/product-item/product-item.container';

import { ProductLinksCarouselComponent } from '../../components/product-links-carousel/product-links-carousel.component';
import { ProductLinksListComponent } from '../../components/product-links-list/product-links-list.component';

import { ProductLinksContainerComponent } from './product-links.container';

describe('Product Links Container', () => {
  let component: ProductLinksContainerComponent;
  let fixture: ComponentFixture<ProductLinksContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), ngrxTesting({ reducers: coreReducers })],
      declarations: [
        MockComponent(ProductItemContainerComponent),
        MockComponent(ProductLinksCarouselComponent),
        MockComponent(ProductLinksListComponent),
        ProductLinksContainerComponent,
      ],
      providers: [{ provide: LARGE_BREAKPOINT_WIDTH, useValue: 992 }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLinksContainerComponent);
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
