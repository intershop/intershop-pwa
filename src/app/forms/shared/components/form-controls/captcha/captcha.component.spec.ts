import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RecaptchaModule } from 'ng-recaptcha';
import { CaptchaComponent } from './captcha.component';

describe('Captcha Component', () => {
  let fixture: ComponentFixture<CaptchaComponent>;
  let component: CaptchaComponent;
  let element: HTMLElement;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [CaptchaComponent],
        imports: [RecaptchaModule.forRoot()],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptchaComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it(`should render controls on the HTML`, () => {
    fixture.detectChanges();
    const elem = element.getElementsByClassName('form-group');
    expect(elem[0].innerHTML).toContain('re-captcha');
  });
});
