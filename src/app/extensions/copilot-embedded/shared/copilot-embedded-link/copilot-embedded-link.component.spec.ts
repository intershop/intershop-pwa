import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';

import { CopilotEmbeddedLinkComponent } from './copilot-embedded-link.component';

describe('Copilot Embedded Link Component', () => {
  let component: CopilotEmbeddedLinkComponent;
  let fixture: ComponentFixture<CopilotEmbeddedLinkComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslatePipe],
      declarations: [CopilotEmbeddedLinkComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopilotEmbeddedLinkComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render icon and label by default', () => {
    fixture.detectChanges();

    expect(element.querySelector('.copilot-embedded-header-link .bi-stars')).toBeTruthy();
    expect(element.querySelector('span')).toBeTruthy();
  });

  it('should render only the icon for the small view', () => {
    component.view = 'small';
    fixture.detectChanges();

    expect(element.querySelector('.copilot-embedded-mobile .bi-stars')).toBeTruthy();
    expect(element.querySelector('span')).toBeFalsy();
  });
});
