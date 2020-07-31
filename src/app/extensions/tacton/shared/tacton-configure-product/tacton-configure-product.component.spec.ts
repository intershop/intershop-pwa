import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ProductView } from 'ish-core/models/product-view/product-view.model';

import { TactonConfigureProductComponent } from './tacton-configure-product.component';

describe('Tacton Configure Product Component', () => {
  let component: TactonConfigureProductComponent;
  let fixture: ComponentFixture<TactonConfigureProductComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [MockComponent(FaIconComponent), TactonConfigureProductComponent],
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

  describe('with product', () => {
    beforeEach(() => {
      component.product = { sku: 'CONFIGURABLE_PRODUCT' } as ProductView;
    });

    it('should display link to product configuration when rendered', () => {
      fixture.detectChanges();

      expect(element).toMatchInlineSnapshot(`
        <a
          class="btn btn-primary btn-lg btn-block"
          role="button"
          ng-reflect-router-link="/configure,CONFIGURABLE_PRODUC"
          title="tacton.configure_product.product.label"
          href="/configure/CONFIGURABLE_PRODUCT"
          >tacton.configure_product.product.label</a
        >
      `);
    });

    it('should display icon for product configuration when rendered in icon mode', () => {
      component.displayType = 'icon';

      fixture.detectChanges();

      expect(element).toMatchInlineSnapshot(`
        <a
          ng-reflect-router-link="/configure,CONFIGURABLE_PRODUC"
          title="tacton.configure_product.product.label"
          href="/configure/CONFIGURABLE_PRODUCT"
          ><fa-icon ng-reflect-icon="fas,cogs"></fa-icon
        ></a>
      `);
    });
  });
});
