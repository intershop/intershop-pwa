import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';
import { ReplaySubject } from 'rxjs';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { SuggestProductsTileComponent } from 'ish-shared/components/search/suggest-products-tile/suggest-products-tile.component';

import { SuggestProductsComponent } from './suggest-products.component';

describe('Suggest Products Component', () => {
  let component: SuggestProductsComponent;
  let fixture: ComponentFixture<SuggestProductsComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(SuggestProductsTileComponent),
        MockDirective(ProductContextDirective),
        SuggestProductsComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestProductsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.products = ['12345', '67890'];
    component.maxAutoSuggests = 2;
    component.inputTerms$ = new ReplaySubject<string>(1);
    component.inputTerms$.next('cat');
    component.deviceType = 'desktop';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  // it('should display the correct number of product suggestions', () => {
  //   fixture.detectChanges();
  //   expect(element.querySelectorAll('li')).toHaveLength(1);
  // });

  // it('should display keyword names correctly', () => {
  //   fixture.detectChanges();
  //   const keywordElements = element.querySelectorAll('ul li a');
  //   expect(keywordElements[1].textContent).toContain('Product 1');
  // });

  // it('should display the image', () => {
  //   const componentSpy = spy(component);
  //   when(componentSpy.getImageEffectiveUrl(component.products[0] as Product)).thenReturn(
  //     'http://domain.com/M/3538322-4095.jpg'
  //   );

  //   fixture.detectChanges();
  //   const imageElement = element.querySelector('img');
  //   expect(imageElement.getAttribute('src')).toBe('http://domain.com/M/3538322-4095.jpg');
  // });

  // it('should display the image not available image', () => {
  //   fixture.detectChanges();
  //   const imageElement = element.querySelector('img');
  //   expect(imageElement.getAttribute('src')).toBe(staticURL.concat('/assets/img/not-available.svg'));
  // });
});
