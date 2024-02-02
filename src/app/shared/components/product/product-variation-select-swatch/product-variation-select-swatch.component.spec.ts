import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { anything, capture, spy, verify } from 'ts-mockito';

import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';

import { ProductVariationSelectSwatchComponent } from './product-variation-select-swatch.component';

describe('Product Variation Select Swatch Component', () => {
  let component: ProductVariationSelectSwatchComponent;
  let fixture: ComponentFixture<ProductVariationSelectSwatchComponent>;
  let element: HTMLElement;

  const group_colorCode = {
    id: 'color',
    attributeType: 'colorCode',
    options: [
      { value: 'black', label: 'Black', metaData: '000000', active: true },
      { value: 'white', label: 'White', metaData: 'FFFFFF' },
    ],
  } as VariationOptionGroup;

  const group_swatchImage = {
    id: 'swatch',
    attributeType: 'swatchImage',
    options: [
      { value: 'Y', label: 'yyy', metaData: 'imageY.png' },
      { value: 'Z', label: 'zzz', metaData: 'imageZ.png', active: true },
    ],
  } as VariationOptionGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ProductVariationSelectSwatchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductVariationSelectSwatchComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.group = group_colorCode;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render a color code when the attribute type is "colorCode"', () => {
    component.group = group_colorCode;
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <ul>
        <li class="selected">
          <button type="button" class="btn btn-link custom-btn-link" title="Black">
            <span style="background-color: rgb(0, 0, 0)"></span>
          </button>
        </li>
        <li>
          <button type="button" class="btn btn-link custom-btn-link" title="White">
            <span class="light-color" style="background-color: rgb(255, 255, 255)"></span>
          </button>
        </li>
      </ul>
    `);
  });

  it('should render a swatch image when the attribute type is "swatchImage"', () => {
    component.group = group_swatchImage;
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <ul>
        <li>
          <button type="button" class="btn btn-link custom-btn-link" title="yyy">
            <img alt="yyy" src="imageY.png" />
          </button>
        </li>
        <li class="selected">
          <button type="button" class="btn btn-link custom-btn-link" title="zzz">
            <img alt="zzz" src="imageZ.png" />
          </button>
        </li>
      </ul>
    `);
  });

  it('should trigger changeOption output handler if color code element is clicked', () => {
    component.group = group_colorCode;
    fixture.detectChanges();
    const emitter = spy(component.changeOption);
    const link = fixture.debugElement.query(By.css('li.selected button')).nativeElement;
    link.dispatchEvent(new Event('click'));

    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toMatchInlineSnapshot(`
      {
        "group": "color",
        "value": "black",
      }
    `);
  });

  it('should trigger changeOption output handler if swatch image element is clicked', () => {
    component.group = group_swatchImage;
    fixture.detectChanges();
    const emitter = spy(component.changeOption);
    const link = fixture.debugElement.query(By.css('li.selected button')).nativeElement;
    link.dispatchEvent(new Event('click'));

    verify(emitter.emit(anything())).once();
    const [arg] = capture(emitter.emit).last();
    expect(arg).toMatchInlineSnapshot(`
      {
        "group": "swatch",
        "value": "Z",
      }
    `);
  });
});
