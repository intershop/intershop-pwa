import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';

import { ProductMasterLinkComponent } from './product-master-link.component';

describe('Product Master Link Component', () => {
  let component: ProductMasterLinkComponent;
  let fixture: ComponentFixture<ProductMasterLinkComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    const context = mock(ProductContextFacade);
    when(context.select('displayProperties', 'variations')).thenReturn(of(true));
    when(context.select('productAsVariationProduct')).thenReturn(
      of({
        productMaster: () => ({
          sku: 'MASTER',
        }),
      } as VariationProductView)
    );

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [MockPipe(ProductRoutePipe, () => '/product/MASTER'), ProductMasterLinkComponent],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMasterLinkComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render link for master product', () => {
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <a
        class="product-variation all-variations-link"
        ng-reflect-router-link="/product/MASTER"
        href="/product/MASTER"
        >product.choose_another_variation.link</a
      >
    `);
  });
});
