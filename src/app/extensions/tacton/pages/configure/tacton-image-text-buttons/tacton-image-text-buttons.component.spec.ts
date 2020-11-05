import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonProductConfigurationParameter } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';

import { TactonImageTextButtonsComponent } from './tacton-image-text-buttons.component';

describe('Tacton Image Text Buttons Component', () => {
  let component: TactonImageTextButtonsComponent;
  let fixture: ComponentFixture<TactonImageTextButtonsComponent>;
  let element: HTMLElement;
  let tactonFacade: TactonFacade;

  beforeEach(async () => {
    tactonFacade = mock(TactonFacade);
    await TestBed.configureTestingModule({
      declarations: [TactonImageTextButtonsComponent],
      providers: [{ provide: TactonFacade, useFactory: () => instance(tactonFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TactonImageTextButtonsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.parameter = ({
      isGroup: false,
      isParameter: true,
      name: 'ID',
      description: 'description',
      value: '0',
      valueDescription: '0',
      committed: false,
      alwaysCommitted: false,
      properties: {
        hidden: 'no',
        guitype: 'imagetext_buttons',
        hasDetailedView: false,
        tc_info_text: 'info',
      },
      domain: {
        name: 'textButtons',
        elements: [
          {
            name: 'i1',
            description: '3',
            state: 'green',
            selected: true,
            properties: { tc_component_picture: 'image1' },
          },
          {
            name: 'i2',
            description: '0',
            state: 'green',
            selected: false,
            properties: { tc_component_picture: 'image2' },
          },
        ],
      },
    } as unknown) as TactonProductConfigurationParameter;

    when(tactonFacade.getImageUrl$('image1')).thenReturn(of('http://xxximage1_key=xyz'));
    when(tactonFacade.getImageUrl$('image2')).thenReturn(of('http://xxximage2_key=xyz'));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render input with min and max if not hidden', () => {
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <div class="d-flex flex-wrap align-items-end pb-2">
        <div class="mr-3">
          <div class="border border-primary"><img src="http://xxximage1_key=xyz" /></div>
          <label><input type="radio" name="ID" value="i1" /> 3 </label>
        </div>
        <div class="mr-3">
          <div class="border"><img src="http://xxximage2_key=xyz" /></div>
          <label><input type="radio" name="ID" value="i2" /> 0 </label>
        </div>
      </div>
    `);
  });

  it('should trigger value commit if value changes', () => {
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = component.parameter.domain.elements[1].name;
    input.dispatchEvent(new Event('change'));

    verify(tactonFacade.commitValue(anything(), anything())).once();
    expect(capture(tactonFacade.commitValue).last()[1]).toMatchInlineSnapshot(`"i2"`);
  });

  it('should trigger value commit if clicked on image', () => {
    fixture.detectChanges();

    fixture.debugElement.queryAll(By.css('img'))[1].triggerEventHandler('click', undefined);

    verify(tactonFacade.commitValue(anything(), anything())).once();
    expect(capture(tactonFacade.commitValue).last()[1]).toMatchInlineSnapshot(`"i2"`);
  });
});
