import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { TactonFacade } from '../../../facades/tacton.facade';

import { TactonStepButtonsComponent } from './tacton-step-buttons.component';

describe('Tacton Step Buttons Component', () => {
  let component: TactonStepButtonsComponent;
  let fixture: ComponentFixture<TactonStepButtonsComponent>;
  let element: HTMLElement;
  let tactonFacade: TactonFacade;

  beforeEach(async () => {
    tactonFacade = mock(TactonFacade);
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [TactonStepButtonsComponent],
      providers: [{ provide: TactonFacade, useFactory: () => instance(tactonFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TactonStepButtonsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(tactonFacade.stepConfig$).thenReturn(of({ length: 1, previousStep: '1', currentStep: '2', nextStep: '3' }));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render button bar if stepConfig is available', () => {
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <div class="d-flex flex-nowrap justify-content-between tacton-buttonbar">
        <div class="d-inline-block mr-auto">
          <button
            class="btn btn-secondary no-wrap text-nowrap"
            data-testing-id="reset-configuration-button"
          >
            tacton.step_buttons.reset.label
          </button>
        </div>
        <div class="d-inline-block ml-2">
          <button class="btn btn-secondary text-nowrap" data-testing-id="previous-button">
            tacton.step_buttons.previous.label
          </button>
        </div>
        <div class="d-inline-block ml-2">
          <button class="btn btn-primary text-nowrap" data-testing-id="next-button">
            tacton.step_buttons.next.label
          </button>
        </div>
      </div>
    `);
  });

  it('should trigger reset configuration if button clicked', () => {
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('[data-testing-id="reset-configuration-button"]')).nativeElement;

    button.dispatchEvent(new Event('click'));

    verify(tactonFacade.resetConfiguration()).once();
  });

  it('should trigger next if button clicked', () => {
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('[data-testing-id="next-button"]')).nativeElement;

    button.dispatchEvent(new Event('click'));

    verify(tactonFacade.changeConfigurationStep('3')).once();
  });

  it('should trigger previous if button clicked', () => {
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('[data-testing-id="previous-button"]')).nativeElement;

    button.dispatchEvent(new Event('click'));

    verify(tactonFacade.changeConfigurationStep('1')).once();
  });

  it('should trigger submit if button clicked', () => {
    when(tactonFacade.stepConfig$).thenReturn(
      of({ length: 1, previousStep: '1', currentStep: '2', nextStep: undefined })
    );

    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('[data-testing-id="submit-button"]')).nativeElement;

    button.dispatchEvent(new Event('click'));

    verify(tactonFacade.submitConfiguration()).once();
  });
});
