import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';

import { CopilotEmbeddedHeaderComponent } from './copilot-embedded-header.component';

describe('Copilot Embedded Header Component', () => {
  let component: CopilotEmbeddedHeaderComponent;
  let fixture: ComponentFixture<CopilotEmbeddedHeaderComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslatePipe],
      declarations: [CopilotEmbeddedHeaderComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopilotEmbeddedHeaderComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display the title and subtitle', () => {
    fixture.detectChanges();

    expect(element.querySelector('.copilot-embedded-header-title').textContent.trim()).toBe('copilot.embedded.title');
    expect(element.querySelector('.copilot-embedded-header-subtitle').textContent.trim()).toBe(
      'copilot.embedded.subtitle'
    );
  });

  it('should show the reset action and emit when it is clicked', () => {
    const emit = jest.spyOn(component.resetChat, 'emit');
    fixture.detectChanges();

    element.querySelector<HTMLButtonElement>('.copilot-embedded-header-reset').click();

    expect(emit).toHaveBeenCalled();
  });

  it('should hide the reset action when reset is unavailable', () => {
    component.canReset = false;
    fixture.detectChanges();

    expect(element.querySelector('.copilot-embedded-header-reset')).toBeNull();
  });
});
