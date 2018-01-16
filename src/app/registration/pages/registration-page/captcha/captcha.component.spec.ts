import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { async, TestBed } from '@angular/core/testing';
import { RecaptchaModule } from 'ng-recaptcha';
import { CaptchaComponent } from './captcha.component';

describe('Captcha Component', () => {
  let fixture: ComponentFixture<CaptchaComponent>;
  let component: CaptchaComponent;
  let element: HTMLElement;
  let debugEl: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CaptchaComponent],
      imports: [RecaptchaModule.forRoot()]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptchaComponent);
    component = fixture.componentInstance;
    debugEl = fixture.debugElement;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it(`should emit 'true' when resolved`, () => {
    component.resolved('Resolved');
    component.isValid.subscribe(data => {
      expect(data).toBe(true);
    });
  });

  it(`should render re-captcha html element on creation`, () => {
    expect(element.querySelector('re-captcha')).toBeTruthy();
  });
});
