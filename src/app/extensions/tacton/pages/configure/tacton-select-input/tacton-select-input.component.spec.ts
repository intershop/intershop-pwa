import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { anything, capture, instance, mock, verify } from 'ts-mockito';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonProductConfigurationParameter } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';

import { TactonSelectInputComponent } from './tacton-select-input.component';

describe('Tacton Select Input Component', () => {
  let component: TactonSelectInputComponent;
  let fixture: ComponentFixture<TactonSelectInputComponent>;
  let element: HTMLElement;
  let tactonFacade: TactonFacade;

  beforeEach(async(() => {
    tactonFacade = mock(TactonFacade);
    TestBed.configureTestingModule({
      declarations: [TactonSelectInputComponent],
      providers: [{ provide: TactonFacade, useFactory: () => instance(tactonFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TactonSelectInputComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.parameter = ({
      isGroup: false,
      isParameter: true,
      name: 'paramID',
      description: 'description',
      value: 'opt5',
      valueDescription: 'OPT5',
      committed: false,
      alwaysCommitted: false,
      properties: {
        art_nr: 'art5',
        guitype: 'dropdown',
        hidden: 'no',
        tc_gui_input: 'dropdown',
        module_ref: 'ref',
        hasDetailedView: false,
      },
      domain: {
        name: 'ref',
        elements: [
          {
            name: 'opt1',
            description: 'OPT1',
            state: 'green',
            selected: false,
            properties: {
              art_nr: 'art1',
              module_ref: 'ref',
            },
          },
          {
            name: 'opt2',
            description: 'OPT2',
            state: 'green',
            selected: false,
            properties: {
              art_nr: 'art2',
              module_ref: 'ref',
            },
          },
          {
            name: 'opt3',
            description: 'OPT3',
            state: 'green',
            selected: false,
            properties: {
              art_nr: 'art3',
              module_ref: 'ref',
            },
          },
          {
            name: 'opt4',
            description: 'OPT4',
            state: 'green',
            selected: false,
            properties: {
              art_nr: 'art4',
              module_ref: 'ref',
            },
          },
          {
            name: 'opt5',
            description: 'OPT5',
            state: 'green',
            selected: true,
            properties: {
              art_nr: 'art5',
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

  it('should render select with options if not hidden', () => {
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <h4>description</h4>
      <div class="row">
        <div class="col-4"></div>
        <div class="col-8">
          <select class="mw-100"
            ><option value="opt1">OPT1</option
            ><option value="opt2">OPT2</option
            ><option value="opt3">OPT3</option
            ><option value="opt4">OPT4</option
            ><option value="opt5">OPT5</option></select
          >
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

    const select = fixture.debugElement.queryAll(By.css('select'))[0].nativeElement;
    select.value = 'opt1';
    select.dispatchEvent(new Event('change'));

    verify(tactonFacade.commitValue(anything(), anything())).once();
    expect(capture(tactonFacade.commitValue).last()[1]).toMatchInlineSnapshot(`"opt1"`);
  });
});
