import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ProductView } from 'ish-core/models/product-view/product-view.model';

import { TactonConfigureProductComponent } from './tacton-configure-product.component';

describe('Tacton Configure Product Component', () => {
  let component: TactonConfigureProductComponent;
  let fixture: ComponentFixture<TactonConfigureProductComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [TactonConfigureProductComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TactonConfigureProductComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not render if product is not supplied', () => {
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`N/A`);
  });

  it('should display link to product configuration when rendered', () => {
    component.product = { sku: 'CONFIGURABLE_PRODUCT' } as ProductView;

    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <a
        class="btn btn-primary btn-lg btn-block"
        ng-reflect-router-link="/configure,CONFIGURABLE_PRODUC"
        href="/configure/CONFIGURABLE_PRODUCT"
        >Configure</a
      >
    `);
  });
});
