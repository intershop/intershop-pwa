import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { LanguageSwitchComponent } from 'ish-shell/header/components/language-switch/language-switch.component';

import { LanguageSwitchContainerComponent } from './language-switch.container';

describe('Language Switch Container', () => {
  let component: LanguageSwitchContainerComponent;
  let fixture: ComponentFixture<LanguageSwitchContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LanguageSwitchContainerComponent, MockComponent(LanguageSwitchComponent)],
      imports: [ngrxTesting()],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(LanguageSwitchContainerComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
