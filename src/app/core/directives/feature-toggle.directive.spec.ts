import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { configurationReducer } from 'ish-core/store/configuration/configuration.reducer';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

@Component({
  template: `
    <div>unrelated</div>
    <div *ishFeature="'feature1'">content1</div>
    <div *ishFeature="'feature2'">content2</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {}

describe('Feature Toggle Directive', () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [
        FeatureToggleModule,
        ngrxTesting({
          reducers: { configuration: configurationReducer },
          config: {
            initialState: { configuration: { features: ['feature1'] } },
          },
        }),
      ],
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
});
