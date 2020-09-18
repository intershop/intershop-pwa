import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { anything, instance, mock, verify } from 'ts-mockito';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonProductConfigurationParameter } from '../../../models/tacton-product-configuration/tacton-product-configuration.model';
import { TactonImageTextButtonsComponent } from '../tacton-image-text-buttons/tacton-image-text-buttons.component';
import { TactonNumberInputComponent } from '../tacton-number-input/tacton-number-input.component';
import { TactonRadioInputComponent } from '../tacton-radio-input/tacton-radio-input.component';
import { TactonReadonlyComponent } from '../tacton-readonly/tacton-readonly.component';
import { TactonSelectInputComponent } from '../tacton-select-input/tacton-select-input.component';
import { TactonSelectedImageComponent } from '../tacton-selected-image/tacton-selected-image.component';
import { TactonTextButtonsComponent } from '../tacton-text-buttons/tacton-text-buttons.component';
import { TactonTextInputComponent } from '../tacton-text-input/tacton-text-input.component';

import { TactonParameterComponent } from './tacton-parameter.component';

describe('Tacton Parameter Component', () => {
  let component: TactonParameterComponent;
  let fixture: ComponentFixture<TactonParameterComponent>;
  let element: HTMLElement;
  let tactonFacade: TactonFacade;

  beforeEach(async () => {
    tactonFacade = mock(TactonFacade);
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [
        FaIconComponent,
        MockComponent(TactonImageTextButtonsComponent),
        MockComponent(TactonNumberInputComponent),
        MockComponent(TactonRadioInputComponent),
        MockComponent(TactonReadonlyComponent),
        MockComponent(TactonSelectInputComponent),
        MockComponent(TactonSelectedImageComponent),
        MockComponent(TactonTextButtonsComponent),
        MockComponent(TactonTextInputComponent),
        TactonParameterComponent,
      ],
      providers: [{ provide: TactonFacade, useFactory: () => instance(tactonFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TactonParameterComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.item = {
      isParameter: true,
      properties: { hidden: 'no', guitype: 'text' },
    } as TactonProductConfigurationParameter;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should not render any input if hidden', () => {
    component.item.properties.hidden = 'yes';
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`N/A`);
  });

  it('should render text parameter if given', () => {
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <div class="border-bottom mb-4">
        <h4 class="font-weight-bold">&nbsp;</h4>
        <ish-tacton-text-input></ish-tacton-text-input>
      </div>
    `);
  });

  it('should render image text buttons parameter if given', () => {
    component.item.properties.guitype = 'imagetext_buttons';
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <div class="border-bottom mb-4">
        <h4 class="font-weight-bold">&nbsp;</h4>
        <ish-tacton-image-text-buttons></ish-tacton-image-text-buttons>
      </div>
    `);
  });

  it('should render selected image parameter if given', () => {
    component.item.properties.guitype = 'selected_image';

    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <div class="border-bottom mb-4">
        <h4 class="font-weight-bold">&nbsp;</h4>
        <ish-tacton-selected-image></ish-tacton-selected-image>
      </div>
    `);
  });

  it('should render text buttons parameter if given', () => {
    component.item.properties.guitype = 'text_buttons';
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <div class="border-bottom mb-4">
        <h4 class="font-weight-bold">&nbsp;</h4>
        <ish-tacton-text-buttons></ish-tacton-text-buttons>
      </div>
    `);
  });

  it('should render dropdown select parameter if given', () => {
    component.item.properties.guitype = 'dropdown';

    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <div class="border-bottom mb-4">
        <h4 class="font-weight-bold">&nbsp;</h4>
        <ish-tacton-select-input></ish-tacton-select-input>
      </div>
    `);
  });

  it('should render a readonly parameter if given', () => {
    component.item.properties.guitype = 'readonly';

    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <div class="border-bottom mb-4">
        <h4 class="font-weight-bold">&nbsp;</h4>
        <ish-tacton-readonly></ish-tacton-readonly>
      </div>
    `);
  });

  it('should render a radio button parameter if given', () => {
    component.item.properties.guitype = 'radio';

    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <div class="border-bottom mb-4">
        <h4 class="font-weight-bold">&nbsp;</h4>
        <ish-tacton-radio-input></ish-tacton-radio-input>
      </div>
    `);
  });

  it('should trigger value uncommit if undo icon is called', () => {
    fixture.detectChanges();

    component.uncommit();

    verify(tactonFacade.uncommitValue(anything())).once();
  });
});
