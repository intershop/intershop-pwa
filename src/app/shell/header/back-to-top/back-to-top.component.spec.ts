import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatePipe, provideTranslateService } from '@ngx-translate/core';
import { MockPipe } from 'ng-mocks';

import { FeatureTogglePipe } from 'ish-core/pipes/feature-toggle.pipe';

import { BackToTopComponent } from './back-to-top.component';

describe('Back To Top Component', () => {
  let component: BackToTopComponent;
  let fixture: ComponentFixture<BackToTopComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslatePipe],
      declarations: [BackToTopComponent, MockPipe(FeatureTogglePipe, () => true)],
      providers: [provideTranslateService()],
    }).compileComponents();
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
