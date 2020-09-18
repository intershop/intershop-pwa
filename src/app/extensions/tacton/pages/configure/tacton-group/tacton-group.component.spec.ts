import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonProductConfigurationGroup } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';
import { TactonParameterComponent } from '../tacton-parameter/tacton-parameter.component';

import { TactonGroupComponent } from './tacton-group.component';

describe('Tacton Group Component', () => {
  let component: TactonGroupComponent;
  let fixture: ComponentFixture<TactonGroupComponent>;
  let element: HTMLElement;
  let tactonFacade: TactonFacade;

  beforeEach(async () => {
    tactonFacade = mock(TactonFacade);
    await TestBed.configureTestingModule({
      declarations: [MockComponent(TactonParameterComponent), TactonGroupComponent],
      providers: [{ provide: TactonFacade, useFactory: () => instance(tactonFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TactonGroupComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.group = {
      isGroup: true,
      isParameter: false,
      description: 'g1',
      name: 'root',
      hasVisibleParameters: true,
      members: [
        { isParameter: true, isGroup: false, properties: { guitype: 'text' } },
        {
          isGroup: true,
          isParameter: false,
          name: 'G11',
          description: 'g11',
          hasVisibleParameters: true,
          members: [{ isParameter: true, properties: { guitype: 'readonly' } }],
        },
        { isGroup: true, isParameter: false, description: 'g12', name: 'G12', hasVisibleParameters: false },
        {
          isParameter: true,
          isGroup: false,
          properties: { guitype: 'text' },
          domain: { min: '1', max: '2' },
        },
        {
          isGroup: true,
          isParameter: false,
          description: 'g13',
          name: 'G13',
          hasVisibleParameters: true,
          members: [{ isParameter: true, isGroup: false, properties: { guitype: 'dropdown' } }],
        },
        {
          isGroup: true,
          isParameter: false,
          description: 'g14',
          name: 'G14',
          hasVisibleParameters: true,
          members: [{ isParameter: true, isGroup: false, properties: { guitype: 'imagetext_buttons' } }],
        },
        {
          isGroup: true,
          isParameter: false,
          description: 'g15',
          name: 'G15',
          hasVisibleParameters: true,
          members: [{ isParameter: true, isGroup: false, properties: { guitype: 'text_buttons' } }],
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
      <h2 id="anchor-root">g1</h2>
      <ish-tacton-parameter></ish-tacton-parameter><span ishintersectionobserver=""></span
      ><ish-tacton-group ng-reflect-level="1"
        ><span class="anchor" id="anchor-G11"></span>
        <h3 ishintersectionobserver="">g11</h3>
        <ish-tacton-parameter></ish-tacton-parameter></ish-tacton-group
      ><span ishintersectionobserver=""></span><ish-tacton-group ng-reflect-level="1"></ish-tacton-group
      ><span ishintersectionobserver=""></span><ish-tacton-parameter></ish-tacton-parameter
      ><span ishintersectionobserver=""></span
      ><ish-tacton-group ng-reflect-level="1"
        ><span class="anchor" id="anchor-G13"></span>
        <h3 ishintersectionobserver="">g13</h3>
        <ish-tacton-parameter></ish-tacton-parameter></ish-tacton-group
      ><span ishintersectionobserver=""></span
      ><ish-tacton-group ng-reflect-level="1"
        ><span class="anchor" id="anchor-G14"></span>
        <h3 ishintersectionobserver="">g14</h3>
        <ish-tacton-parameter></ish-tacton-parameter></ish-tacton-group
      ><span ishintersectionobserver=""></span
      ><ish-tacton-group ng-reflect-level="1"
        ><span class="anchor" id="anchor-G15"></span>
        <h3 ishintersectionobserver="">g15</h3>
        <ish-tacton-parameter></ish-tacton-parameter
      ></ish-tacton-group>
    `);
  });

  it('should only render groups if they have visible elements', () => {
    fixture.detectChanges();

    expect(element.textContent).not.toContain('g12');
  });
});
