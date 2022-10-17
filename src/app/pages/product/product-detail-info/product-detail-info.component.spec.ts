import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

import { ProductDetailInfoComponent } from './product-detail-info.component';

describe('Product Detail Info Component', () => {
  let component: ProductDetailInfoComponent;
  let fixture: ComponentFixture<ProductDetailInfoComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.select('product')).thenReturn(of({ sku: '123' } as ProductView));
    when(context.select('sku')).thenReturn(of('123'));
    when(context.select('variationCount')).thenReturn(of(0));

    await TestBed.configureTestingModule({
      imports: [FeatureToggleModule.forTesting('rating'), NgbNavModule, TranslateModule.forRoot()],
      declarations: [MockDirective(ServerHtmlDirective), ProductDetailInfoComponent],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailInfoComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the product description tab with status active', () => {
    fixture.detectChanges();

    expect(element.querySelectorAll('ul.nav-tabs li')).toHaveLength(2);
    expect(element.querySelector('ul.nav-tabs li[data-testing-id=product-description-tab] a.active')).toBeTruthy();
  });

  it('should not display the product rating tab for variation master', () => {
    when(context.select('variationCount')).thenReturn(of(2));

    fixture.detectChanges();

    expect(element.querySelectorAll('ul.nav-tabs li')).toHaveLength(1);
  });
});
