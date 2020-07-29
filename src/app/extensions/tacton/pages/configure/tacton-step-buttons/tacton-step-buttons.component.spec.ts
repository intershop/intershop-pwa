import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { TactonFacade } from '../../../facades/tacton.facade';

import { TactonStepButtonsComponent } from './tacton-step-buttons.component';

describe('Tacton Step Buttons Component', () => {
  let component: TactonStepButtonsComponent;
  let fixture: ComponentFixture<TactonStepButtonsComponent>;
  let element: HTMLElement;
  let tactonFacade: TactonFacade;

  beforeEach(async(() => {
    tactonFacade = mock(TactonFacade);
    TestBed.configureTestingModule({
      declarations: [TactonStepButtonsComponent],
      providers: [{ provide: TactonFacade, useFactory: () => instance(tactonFacade) }],
    }).compileComponents();
  }));

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
      <div class="d-flex flex-nowrap justify-content-between">
        <button class="btn btn-secondary no-wrap" data-testing-id="reset-configuration-button">
          Reset Configuration
        </button>
        <div>
          <div class="d-inline-block">
            <button class="btn btn-secondary" data-testing-id="previous-button">Previous</button>
          </div>
          <div class="d-inline-block ml-2">
            <button class="btn btn-primary" data-testing-id="next-button">Next</button>
          </div>
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
