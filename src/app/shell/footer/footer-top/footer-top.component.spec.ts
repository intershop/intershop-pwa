import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MockComponent } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';

import { FooterTopComponent } from './footer-top.component';

describe('Footer Top Component', () => {
  let component: FooterTopComponent;
  let fixture: ComponentFixture<FooterTopComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterTopComponent, MockComponent(FaIconComponent)],
      imports: [FeatureToggleModule.forTesting('storeLocator')],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterTopComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
