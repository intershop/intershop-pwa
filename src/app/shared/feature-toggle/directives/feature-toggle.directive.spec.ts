import { ChangeDetectionStrategy, Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureToggleModule } from '../../feature-toggle.module';

@Component({
  template: `
  <div>unrelated</div>
  <div *ishFeature="'feature1'">content1</div>
  <div *ishFeature="'feature2'">content2</div>
  <div *ishFeature="'feature3'">content3</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:prefer-mocks-instead-of-stubs-in-tests
class TestComponent {}

describe('Feature Toggle Directive', () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [FeatureToggleModule.testingFeatures({ feature1: true, feature2: false })],
    }).compileComponents();
  }));

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

  it('should render content of unhandled features', () => {
    expect(element.textContent).toContain('content3');
  });
});
