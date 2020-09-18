import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';

@Component({
  template: `
    <div>unrelated</div>
    <div *ishNotFeature="'feature1'">content1</div>
    <div *ishNotFeature="'feature2'">content2</div>
    <div *ishNotFeature="'always'">contentAlways</div>
    <div *ishNotFeature="'never'">contentNever</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {}

describe('Not Feature Toggle Directive', () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [FeatureToggleModule.forTesting('feature1')],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should always render unreleated content', () => {
    expect(element.textContent).toContain('unrelated');
  });

  it('should not render content of enabled features', () => {
    expect(element.textContent).not.toContain('content1');
  });

  it('should render content of disabled features', () => {
    expect(element.textContent).toContain('content2');
  });

  it("should never render content for 'always'", () => {
    expect(element.textContent).not.toContain('contentAlways');
  });

  it("should always render content for 'never'", () => {
    expect(element.textContent).toContain('contentNever');
  });
});
