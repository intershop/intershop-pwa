import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { anything, capture, instance, mock, verify } from 'ts-mockito';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonProductConfigurationParameter } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';

import { TactonNumberInputComponent } from './tacton-number-input.component';

describe('Tacton Number Input Component', () => {
  let component: TactonNumberInputComponent;
  let fixture: ComponentFixture<TactonNumberInputComponent>;
  let element: HTMLElement;
  let tactonFacade: TactonFacade;

  beforeEach(async(() => {
    tactonFacade = mock(TactonFacade);
    TestBed.configureTestingModule({
      declarations: [TactonNumberInputComponent],
      providers: [{ provide: TactonFacade, useFactory: () => instance(tactonFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TactonNumberInputComponent);
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
        guitype: 'text',
        hasDetailedView: false,
        tc_info_text: 'info',
      },
      domain: {
        name: 'int',
        max: '3',
        min: '0',
        elements: [
          {
            name: 'max',
            description: '3',
            state: 'green',
            selected: false,
          },
          {
            name: 'min',
            description: '0',
            state: 'green',
            selected: false,
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

  it('should render input with min and max if not hidden', () => {
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <h4>description</h4>
      <div class="row">
        <div class="col-4">info</div>
        <div class="col-8"><input type="number" min="0" max="3" /></div>
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

    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = '3';
    input.dispatchEvent(new Event('change'));

    verify(tactonFacade.commitValue(anything(), anything())).once();
    expect(capture(tactonFacade.commitValue).last()[1]).toMatchInlineSnapshot(`"3"`);
  });
});
