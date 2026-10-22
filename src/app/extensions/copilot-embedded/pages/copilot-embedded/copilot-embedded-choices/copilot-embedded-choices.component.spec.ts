import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { anything, capture, spy, verify } from 'ts-mockito';

import { CopilotEmbeddedChoicesComponent } from './copilot-embedded-choices.component';

describe('Copilot Embedded Choices Component', () => {
  let component: CopilotEmbeddedChoicesComponent;
  let fixture: ComponentFixture<CopilotEmbeddedChoicesComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslatePipe],
      declarations: [CopilotEmbeddedChoicesComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopilotEmbeddedChoicesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.componentRef.setInput('choices', { options: ['In the office', 'Hybrid', 'Mobile'], multiSelect: false });
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render single-select chips without a confirm button', () => {
    fixture.detectChanges();

    expect(element.querySelectorAll('.copilot-embedded-choice-chip')).toHaveLength(3);
    expect(element.querySelector('.copilot-embedded-choice-confirm')).toBeFalsy();
  });

  it('should emit the option label when a single-select chip is clicked', () => {
    const emitter = spy(component.answer);
    fixture.detectChanges();

    element.querySelectorAll<HTMLButtonElement>('.copilot-embedded-choice-chip')[1].click();

    verify(emitter.emit(anything())).once();
    expect(capture(emitter.emit).last()).toEqual(['Hybrid']);
  });

  describe('multi-select', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('choices', {
        options: ['Docking station', 'Headset', 'Monitor'],
        multiSelect: true,
      });
    });

    it('should keep the confirm button disabled while nothing is selected', () => {
      fixture.detectChanges();

      expect(element.querySelector<HTMLButtonElement>('.copilot-embedded-choice-confirm').disabled).toBeTrue();
    });

    it('should emit the joined selection on confirm', () => {
      const emitter = spy(component.answer);
      fixture.detectChanges();

      const chips = element.querySelectorAll<HTMLButtonElement>('.copilot-embedded-choice-chip');
      chips[0].click();
      chips[1].click();
      fixture.detectChanges();

      const confirm = element.querySelector<HTMLButtonElement>('.copilot-embedded-choice-confirm');
      expect(confirm.disabled).toBeFalse();
      confirm.click();

      verify(emitter.emit(anything())).once();
      expect(capture(emitter.emit).last()).toEqual(['Docking station, Headset']);
    });

    it('should render a selected chip as primary button', () => {
      fixture.detectChanges();

      const chip = element.querySelectorAll<HTMLButtonElement>('.copilot-embedded-choice-chip')[0];
      chip.click();
      fixture.detectChanges();

      expect(chip.classList).toContain('btn-primary');
      expect(chip.classList).not.toContain('btn-secondary');
      expect(chip.getAttribute('aria-pressed')).toBe('true');
    });

    it('should deselect an option on a second click', () => {
      fixture.detectChanges();

      component.toggleOption('Monitor');
      component.toggleOption('Monitor');

      expect(component.selectedOptions.size).toBe(0);
    });
  });

  it('should focus the chip group after rendering', () => {
    fixture.detectChanges();

    expect(document.activeElement).toBe(element.querySelector('.copilot-embedded-choices'));
  });
});
