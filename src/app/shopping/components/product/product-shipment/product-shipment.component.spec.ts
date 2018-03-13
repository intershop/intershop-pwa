import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as using from 'jasmine-data-provider';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Product } from '../../../../models/product/product.model';
import { ModalDialogComponent } from '../../../../shared/components/modal-dialog/modal-dialog.component';
import { ProductShipmentComponent } from './product-shipment.component';

describe('Product Shipment Component', () => {
  let component: ProductShipmentComponent;
  let fixture: ComponentFixture<ProductShipmentComponent>;
  let product: Product;
  let translate: TranslateService;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ModalModule.forRoot()
      ],
      providers: [
        TranslateService
      ],
      declarations: [ProductShipmentComponent, ModalDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductShipmentComponent);
    component = fixture.componentInstance;
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    product = new Product('sku');
    product.availability = true;
    element = fixture.nativeElement;
    component.product = product;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should throw an error if input parameter product is not set properly', () => {
    component.product = null;
    expect(function() { component.ngOnChanges(); }).toThrow();
  });

  it('should not render when readyForShipmentMin and readyForShipmentMax are not available', () => {
    fixture.detectChanges();
    expect(element.querySelector('.ready-for-shipment')).toBeFalsy();
  });

  describe('text rendering', () => {
    function dataProvider() {
      return [
        { readyForShipmentMin: 0, readyForShipmentMax: 1, localeKey: 'product.ready_for_shipment.within24', localeValue: 'Usually ships within 24 hours', expectedText: 'Usually ships within 24 hours' },
        { readyForShipmentMin: 0, readyForShipmentMax: 3, localeKey: 'product.ready_for_shipment.within', localeValue: 'Usually ships within {{0}} days.', expectedText: 'Usually ships within 3 days.' },
        { readyForShipmentMin: 3, readyForShipmentMax: 7, localeKey: 'product.ready_for_shipment.minmax', localeValue: 'Usually ships in {{0}} to {{1}} days.', expectedText: 'Usually ships in 3 to 7 days.' },
      ];
    }
    using(dataProvider, (dataSlice) => {
      it(`should use "${dataSlice.localeKey}" localization text when readyForShipmentMin = ${dataSlice.readyForShipmentMin} and readyForShipmentMax = ${dataSlice.readyForShipmentMax}`, () => {
        product.readyForShipmentMin = dataSlice.readyForShipmentMin;
        product.readyForShipmentMax = dataSlice.readyForShipmentMax;
        translate.set(dataSlice.localeKey, dataSlice.localeValue);
        component.isShipmentInformationAvailable = true;
        fixture.detectChanges();
        expect(element.querySelector('.ready-for-shipment').textContent).toContain(dataSlice.expectedText);
      });
    });
  });
});
