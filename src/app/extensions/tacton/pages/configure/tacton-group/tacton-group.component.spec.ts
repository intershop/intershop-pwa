import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { TactonProductConfigurationGroup } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';
import { TactonImageTextButtonsComponent } from '../tacton-image-text-buttons/tacton-image-text-buttons.component';
import { TactonNumberInputComponent } from '../tacton-number-input/tacton-number-input.component';
import { TactonRadioInputComponent } from '../tacton-radio-input/tacton-radio-input.component';
import { TactonReadonlyComponent } from '../tacton-readonly/tacton-readonly.component';
import { TactonSelectInputComponent } from '../tacton-select-input/tacton-select-input.component';
import { TactonTextInputComponent } from '../tacton-text-input/tacton-text-input.component';

import { TactonGroupComponent } from './tacton-group.component';

describe('Tacton Group Component', () => {
  let component: TactonGroupComponent;
  let fixture: ComponentFixture<TactonGroupComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent(TactonImageTextButtonsComponent),
        MockComponent(TactonNumberInputComponent),
        MockComponent(TactonRadioInputComponent),
        MockComponent(TactonReadonlyComponent),
        MockComponent(TactonSelectInputComponent),
        MockComponent(TactonTextInputComponent),
        TactonGroupComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TactonGroupComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.group = {
      isGroup: true,
      description: 'g1',
      name: 'root',
      hasVisibleParameters: true,
      members: [
        { isParameter: true, properties: { guitype: 'text' } },
        {
          isGroup: true,
          name: 'G11',
          description: 'g11',
          hasVisibleParameters: true,
          members: [{ isParameter: true, properties: { guitype: 'readonly' } }],
        },
        { isGroup: true, description: 'g12', name: 'G12', hasVisibleParameters: false },
        { isParameter: true, properties: { guitype: 'text' }, domain: { min: '1', max: 2 } },
        {
          isGroup: true,
          description: 'g13',
          name: 'G13',
          hasVisibleParameters: true,
          members: [{ isParameter: true, properties: { guitype: 'dropdown' } }],
        },
        {
          isGroup: true,
          description: 'g14',
          name: 'G14',
          hasVisibleParameters: true,
          members: [{ isParameter: true, properties: { guitype: 'imagetext_buttons' } }],
        },
      ],
    } as TactonProductConfigurationGroup;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render elements of group recursively', () => {
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <h3 id="root">g1</h3>
      <ish-tacton-text-input></ish-tacton-text-input
      ><ish-tacton-group
        ><h3 id="G11">g11</h3>
        <ish-tacton-readonly></ish-tacton-readonly></ish-tacton-group
      ><ish-tacton-group></ish-tacton-group><ish-tacton-number-input></ish-tacton-number-input
      ><ish-tacton-group
        ><h3 id="G13">g13</h3>
        <ish-tacton-select-input></ish-tacton-select-input></ish-tacton-group
      ><ish-tacton-group
        ><h3 id="G14">g14</h3>
        <ish-tacton-image-text-buttons></ish-tacton-image-text-buttons
      ></ish-tacton-group>
    `);
  });

  it('should only render groups if they have visible elements', () => {
    fixture.detectChanges();

    expect(element.textContent).not.toContain('g12');
  });
});
