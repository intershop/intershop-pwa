import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';

import { ProductVariationSelectEnhancedComponent } from './product-variation-select-enhanced.component';

describe('Product Variation Select Enhanced Component', () => {
  let component: ProductVariationSelectEnhancedComponent;
  let fixture: ComponentFixture<ProductVariationSelectEnhancedComponent>;
  let element: HTMLElement;
  let appFacade: AppFacade;

  const group_colorCode = {
    id: 'color',
    attributeType: 'defaultAndColorCode',
    options: [
      { value: 'black', label: 'Black', metaData: '000000', active: true },
      { value: 'white', label: 'White', metaData: 'FFFFFF' },
    ],
  } as VariationOptionGroup;

  const group_swatchImage = {
    id: 'swatch',
    attributeType: 'defaultAndSwatchImage',
    options: [
      { value: 'Y', label: 'yyy', metaData: 'imageY.png' },
      { value: 'Z', label: 'zzz', metaData: 'imageZ.png', active: true },
    ],
  } as VariationOptionGroup;

  beforeEach(async () => {
    appFacade = mock(AppFacade);
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ProductVariationSelectEnhancedComponent],
      providers: [{ provide: AppFacade, useFactory: () => instance(appFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductVariationSelectEnhancedComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.group = group_colorCode;
    component.uuid = 'uuid';
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render a color code select when the attribute type is "defaultAndColorCode" for mobile', () => {
    component.group = group_colorCode;
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <div class="mobile-variation-select">
        <div class="mobile-variation-option">
          <a ng-reflect-router-link="" href="/"
            ><span class="color-code" style="background-color: rgb(0, 0, 0)"></span
            ><span class="label selected">Black </span></a
          >
        </div>
        <div class="mobile-variation-option">
          <a ng-reflect-router-link="" href="/"
            ><span class="color-code light-color" style="background-color: rgb(255, 255, 255)"></span
            ><span class="label">White </span></a
          >
        </div>
      </div>
    `);
  });

  it('should render a swatch image select when the attribute type is "defaultAndColorCode" for desktop', () => {
    when(appFacade.deviceType$).thenReturn(of('desktop'));
    component.group = group_swatchImage;
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <div ngbdropdown="">
        <button ngbdropdowntoggle="" type="button" class="btn variation-select" id="uuidswatch">
          <img class="image-swatch" alt="zzz" src="imageZ.png" /><span class="label selected">zzz </span>
        </button>
        <div ngbdropdownmenu="" class="variation-options" aria-labelledby="uuidswatchlabel">
          <button ngbdropdownitem="" value="Y" data-testing-id="swatch-Y">
            <img class="image-swatch" alt="yyy" src="imageY.png" /><span class="label">yyy </span></button
          ><button ngbdropdownitem="" value="Z" data-testing-id="swatch-Z">
            <img class="image-swatch" alt="zzz" src="imageZ.png" /><span class="label selected"
              >zzz
            </span>
          </button>
        </div>
      </div>
    `);
  });

  it('should trigger changeOption output handler if color code element is clicked (mobile)', () => {
    component.group = group_colorCode;
    fixture.detectChanges();
    const emitter = spy(component.changeOption);
    const link = fixture.debugElement.query(By.css('.label.selected')).parent.nativeElement;
    link.dispatchEvent(new Event('click'));

    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toMatchInlineSnapshot(`
      Object {
        "group": "color",
        "value": "black",
      }
    `);
  });

  it('should trigger changeOption output handler if swatch image element is clicked (desktop)', () => {
    when(appFacade.deviceType$).thenReturn(of('desktop'));
    component.group = group_swatchImage;
    fixture.detectChanges();
    const emitter = spy(component.changeOption);
    const link = fixture.debugElement.queryAll(By.css('.label.selected')).pop().parent.nativeElement;
    link.dispatchEvent(new Event('click'));

    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toMatchInlineSnapshot(`
      Object {
        "group": "swatch",
        "value": "Z",
      }
    `);
  });
});
