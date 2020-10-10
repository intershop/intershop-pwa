import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { ModalDialogLinkComponent } from 'ish-shared/components/common/modal-dialog-link/modal-dialog-link.component';

import { ProductShipmentComponent } from './product-shipment.component';

describe('Product Shipment Component', () => {
  let component: ProductShipmentComponent;
  let fixture: ComponentFixture<ProductShipmentComponent>;
  let translate: TranslateService;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    when(context.select('displayProperties', 'shipment')).thenReturn(of(true));

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        MockComponent(ContentIncludeComponent),
        MockComponent(ModalDialogLinkComponent),
        ProductShipmentComponent,
      ],
      providers: [{ provide: ProductContextFacade, useFactory: () => instance(context) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductShipmentComponent);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not render when not displayed', () => {
    when(context.select('displayProperties', 'shipment')).thenReturn(of(false));

    fixture.detectChanges();
    expect(element.querySelector('.ready-for-shipment')).toBeFalsy();
  });

  describe('text rendering', () => {
    it.each([
      ['product.ready_for_shipment.within24', 0, 1, 'Usually ships within 24 hours', 'Usually ships within 24 hours'],
      ['product.ready_for_shipment.within', 0, 3, 'Usually ships within {{0}} days.', 'Usually ships within 3 days.'],
      [
        'product.ready_for_shipment.minmax',
        3,
        7,
        'Usually ships in {{0}} to {{1}} days.',
        'Usually ships in 3 to 7 days.',
      ],
    ])(
      `should use "%s" localization text when readyForShipmentMin = %i and readyForShipmentMax = %i`,
      (localeKey, readyForShipmentMin, readyForShipmentMax, localeValue, expectedText) => {
        when(context.select('product', 'readyForShipmentMin')).thenReturn(of(readyForShipmentMin));
        when(context.select('product', 'readyForShipmentMax')).thenReturn(of(readyForShipmentMax));
        translate.set(localeKey, localeValue);

        fixture.detectChanges();

        expect(element.querySelector('.ready-for-shipment').textContent).toContain(expectedText);
      }
    );
  });
});
