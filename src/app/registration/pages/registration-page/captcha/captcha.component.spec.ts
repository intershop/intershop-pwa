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

  it(`should check if controls are rendered on the HTML`, () => {
    const elem = element.getElementsByClassName('form-group');
    expect(elem[0].innerHTML).toContain('re-captcha');
  });

});
