import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { FeatureTogglePipe } from 'ish-core/pipes/feature-toggle.pipe';

import { BackToTopComponent } from './back-to-top.component';

describe('Back To Top Component', () => {
  let component: BackToTopComponent;
  let fixture: ComponentFixture<BackToTopComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideTranslateService()],
      imports: [BackToTopComponent],
    })
      .overrideComponent(BackToTopComponent, {
        remove: { imports: [FeatureTogglePipe] },
        add: { imports: [MockPipe(FeatureTogglePipe, () => true)] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackToTopComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
