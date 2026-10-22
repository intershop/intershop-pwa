import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopilotEmbeddedIconComponent } from './copilot-embedded-icon.component';

describe('Copilot Embedded Icon Component', () => {
  let component: CopilotEmbeddedIconComponent;
  let fixture: ComponentFixture<CopilotEmbeddedIconComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CopilotEmbeddedIconComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopilotEmbeddedIconComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render the default icon', () => {
    fixture.detectChanges();

    expect(element.querySelector('.copilot-embedded-icon .bi-stars')).toBeTruthy();
    expect(element.querySelector('.copilot-embedded-icon-large')).toBeFalsy();
  });

  it('should render the large icon', () => {
    fixture.componentRef.setInput('size', 'large');
    fixture.detectChanges();

    expect(element.querySelector('.copilot-embedded-icon-large')).toBeTruthy();
  });
});
