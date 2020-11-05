import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { LARGE_BREAKPOINT_WIDTH } from 'ish-core/configurations/injection-keys';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';

import { ProductLinksCarouselComponent } from '../product-links-carousel/product-links-carousel.component';
import { ProductLinksListComponent } from '../product-links-list/product-links-list.component';

import { ProductLinksComponent } from './product-links.component';

describe('Product Links Component', () => {
  let component: ProductLinksComponent;
  let fixture: ComponentFixture<ProductLinksComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(ProductLinksCarouselComponent),
        MockComponent(ProductLinksListComponent),
        ProductLinksComponent,
      ],
      providers: [
        { provide: LARGE_BREAKPOINT_WIDTH, useValue: 992 },
        { provide: ShoppingFacade, useFactory: () => instance(mock(ShoppingFacade)) },
      ],
    }).compileComponents();
  });

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
