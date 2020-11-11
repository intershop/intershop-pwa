import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';

import { FeatureTogglePipe } from './feature-toggle.pipe';

@Component({
  template: `
    <div>unrelated</div>
    <div *ngIf="'feature1' | ishFeature">content1</div>
    <div *ngIf="'feature2' | ishFeature">content2</div>
    <div *ngIf="'always' | ishFeature">contentAlways</div>
    <div *ngIf="'never' | ishFeature">contentNever</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {}

describe('Feature Toggle Pipe', () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FeatureToggleModule.forTesting('feature1')],
      declarations: [FeatureTogglePipe, TestComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should always render unreleated content', () => {
    expect(element.textContent).toContain('unrelated');
  });

  it('should render content of enabled features', () => {
    expect(element.textContent).toContain('content1');
  });

  it('should not render content of disabled features', () => {
    expect(element.textContent).not.toContain('content2');
  });

  it("should always render content for 'always'", () => {
    expect(element.textContent).toContain('contentAlways');
  });

  it("should never render content for 'never'", () => {
    expect(element.textContent).not.toContain('contentNever');
  });
});
