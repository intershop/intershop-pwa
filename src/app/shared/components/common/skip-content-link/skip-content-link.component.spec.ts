import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { SkipContentLinkComponent } from './skip-content-link.component';

@Component({
  template: `
    <ish-skip-content-link [skipToElementId]="skipToElementId">
      <ul></ul>
    </ish-skip-content-link>
    <div id="valid-element-id" tabindex="-1"></div>
  `,
})
class TestHostComponent {
  skipToElementId?: string;
}

describe('Skip Content Link Component', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let element: HTMLElement;

  let skipContentLinkComponent: SkipContentLinkComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [SkipContentLinkComponent, TestHostComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.skipToElementId = undefined;

    skipContentLinkComponent = fixture.debugElement.query(By.directive(SkipContentLinkComponent)).componentInstance;
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(SkipContentLinkComponent);
    const component = fixture.componentInstance;
    const element = fixture.nativeElement;

    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should generate a focusable element after the listing when no skipToElementId is provided', () => {
    fixture.detectChanges();

    expect(component.skipToElementId).toBeUndefined();
    expect(skipContentLinkComponent.generatedElementAfterListingId).toBeTruthy();
    expect(element.querySelector(`#${skipContentLinkComponent.generatedElementAfterListingId}`)).toBeTruthy();
  });

  it('should generate a focusable element after the listing when skipToElementId is invalid', () => {
    component.skipToElementId = 'invalid-element-id';

    fixture.detectChanges();

    expect(component.skipToElementId).toBeTruthy();
    expect(skipContentLinkComponent.generatedElementAfterListingId).toBeTruthy();
    expect(element.querySelector(`#${skipContentLinkComponent.generatedElementAfterListingId}`)).toBeTruthy();
  });

  it('should not generate a focusable element after the listing when skipToElementId is provided and valid', () => {
    component.skipToElementId = 'valid-element-id';

    fixture.detectChanges();

    expect(skipContentLinkComponent.skipToElementId).toBeTruthy();
    expect(skipContentLinkComponent.generatedElementAfterListingId).toBeFalsy();
    expect(element.querySelector('[id^="element-after-listing-"]')).toBeNull();
  });
});
