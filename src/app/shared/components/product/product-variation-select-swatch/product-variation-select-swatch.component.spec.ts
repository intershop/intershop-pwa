import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { anything, capture, spy, verify } from 'ts-mockito';

import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';

import { ProductVariationSelectSwatchComponent } from './product-variation-select-swatch.component';

describe('Product Variation Select Swatch Component', () => {
  let component: ProductVariationSelectSwatchComponent;
  let fixture: ComponentFixture<ProductVariationSelectSwatchComponent>;
  let element: HTMLElement;

  const groupColorCode = {
    id: 'color',
    attributeType: 'colorCode',
    options: [
      { value: 'black', label: 'Black', metaData: '000000', active: true },
      { value: 'white', label: 'White', metaData: 'FFFFFF' },
    ],
  } as VariationOptionGroup;

  const groupSwatchImage = {
    id: 'swatch',
    attributeType: 'swatchImage',
    options: [
      { value: 'Y', label: 'yyy', metaData: 'imageY.png' },
      { value: 'Z', label: 'zzz', metaData: 'imageZ.png', active: true },
    ],
  } as VariationOptionGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductVariationSelectSwatchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductVariationSelectSwatchComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.group = groupColorCode;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render a color code when the attribute type is "colorCode"', () => {
    component.group = groupColorCode;
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <ul>
        <li class="selected">
          <a tabindex="0" title="Black"><span style="background-color: rgb(0, 0, 0)"></span></a>
        </li>
        <li>
          <a tabindex="0" title="White"
            ><span class="light-color" style="background-color: rgb(255, 255, 255)"></span
          ></a>
        </li>
      </ul>
    `);
  });

  it('should render a swatch image when the attribute type is "swatchImage"', () => {
    component.group = groupSwatchImage;
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <ul>
        <li>
          <a tabindex="0" title="yyy"><img alt="yyy" src="imageY.png" /></a>
        </li>
        <li class="selected">
          <a tabindex="0" title="zzz"><img alt="zzz" src="imageZ.png" /></a>
        </li>
      </ul>
    `);
  });

  it('should trigger changeOption output handler if color code element is clicked', () => {
    component.group = groupColorCode;
    fixture.detectChanges();
    const emitter = spy(component.changeOption);
    const link = fixture.debugElement.query(By.css('li.selected a')).nativeElement;
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
    component.group = groupSwatchImage;
    fixture.detectChanges();
    const emitter = spy(component.changeOption);
    const link = fixture.debugElement.query(By.css('li.selected a')).nativeElement;
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
