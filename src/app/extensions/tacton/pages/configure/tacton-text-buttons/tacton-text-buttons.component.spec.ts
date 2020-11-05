import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { anything, capture, instance, mock, verify } from 'ts-mockito';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonProductConfigurationParameter } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';

import { TactonTextButtonsComponent } from './tacton-text-buttons.component';

describe('Tacton Text Buttons Component', () => {
  let component: TactonTextButtonsComponent;
  let fixture: ComponentFixture<TactonTextButtonsComponent>;
  let element: HTMLElement;
  let tactonFacade: TactonFacade;

  beforeEach(async () => {
    tactonFacade = mock(TactonFacade);
    await TestBed.configureTestingModule({
      declarations: [TactonTextButtonsComponent],
      providers: [{ provide: TactonFacade, useFactory: () => instance(tactonFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TactonTextButtonsComponent);
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
        guitype: 'text_buttons',
        hasDetailedView: false,
        tc_info_text: 'info',
      },
      domain: {
        name: 'textButtons',
        elements: [
          {
            name: 'b1',
            description: 'yes',
            state: 'green',
            selected: true,
          },
          {
            name: 'b2',
            description: 'no',
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

  it('should render text buttons if not hidden', () => {
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <div>info</div>
      <div class="btn-group btn-group-toggle form-group" data-toggle="buttons">
        <label class="btn btn-primary active"><input type="radio" name="ID" id="b1" /> yes </label
        ><label class="btn btn-primary"><input type="radio" name="ID" id="b2" /> no </label>
      </div>
    `);
  });

  it('should trigger value commit if button clicked', () => {
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#b2')).nativeElement;

    button.dispatchEvent(new Event('click'));

    verify(tactonFacade.commitValue(anything(), anything())).once();
    expect(capture(tactonFacade.commitValue).last()[1]).toMatchInlineSnapshot(`"b2"`);
  });
});
