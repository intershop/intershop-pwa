import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { anything, capture, instance, mock, verify } from 'ts-mockito';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonProductConfigurationParameter } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';

import { TactonRadioInputComponent } from './tacton-radio-input.component';

describe('Tacton Radio Input Component', () => {
  let component: TactonRadioInputComponent;
  let fixture: ComponentFixture<TactonRadioInputComponent>;
  let element: HTMLElement;
  let tactonFacade: TactonFacade;

  beforeEach(async(() => {
    tactonFacade = mock(TactonFacade);
    TestBed.configureTestingModule({
      declarations: [TactonRadioInputComponent],
      providers: [{ provide: TactonFacade, useFactory: () => instance(tactonFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TactonRadioInputComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.parameter = ({
      isGroup: false,
      isParameter: true,
      name: 'paramID',
      description: 'Terminals type',
      value: 'opt1',
      valueDescription: 'OPT2',
      committed: false,
      alwaysCommitted: false,
      properties: {
        art_nr: 'NR2',
        guitype: 'radio',
        hidden: 'no',
        tc_gui_input: 'radio',
        module_ref: 'ref',
        hasDetailedView: false,
      },
      domain: {
        name: 'ref',
        elements: [
          {
            name: 'opt1',
            description: 'Number1',
            state: 'green',
            selected: false,
            properties: {
              art_nr: 'NR1',
              module_ref: 'ref',
            },
          },
          {
            name: 'opt2',
            description: 'Number2',
            state: 'green',
            selected: true,
            properties: {
              art_nr: 'NR2',
              module_ref: 'ref',
            },
          },
        ],
      },
    } as unknown) as TactonProductConfigurationParameter;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render input radio option group if not hidden', () => {
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <h4>Terminals type</h4>
      <div class="row">
        <div class="col-4"></div>
        <div class="col-8">
          <div><input type="radio" name="paramID" value="opt1" /><label>Number1</label></div>
          <div><input type="radio" name="paramID" value="opt2" /><label>Number2</label></div>
        </div>
      </div>
    `);
  });

  it('should not render input if hidden', () => {
    component.parameter.properties.hidden = 'yes';
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`N/A`);
  });

  it('should trigger value commit if value changes', () => {
    fixture.detectChanges();

    const input = fixture.debugElement.queryAll(By.css('input'))[0].nativeElement;
    input.dispatchEvent(new Event('change'));

    verify(tactonFacade.commitValue(anything(), anything())).once();
    expect(capture(tactonFacade.commitValue).last()[1]).toMatchInlineSnapshot(`"opt1"`);
  });
});
