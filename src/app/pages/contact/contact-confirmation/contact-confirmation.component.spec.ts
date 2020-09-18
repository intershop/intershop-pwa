import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ContactConfirmationComponent } from './contact-confirmation.component';

describe('Contact Confirmation Component', () => {
  let component: ContactConfirmationComponent;
  let fixture: ComponentFixture<ContactConfirmationComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactConfirmationComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactConfirmationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it("should show confirmation success, when 'success' is true", () => {
    component.success = true;
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <p data-testing-id="successText">
        helpdesk.contactus.thankyou<br />
        helpdesk.contactus.youwillreceive
      </p>
      <p><a routerlink="/home">helpdesk.contactus.continueshopping</a></p>
    `);
  });

  it("should show confirmation failed, when 'success' is false", () => {
    component.success = false;
    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`
      <div class="alert alert-danger" role="alert">
        <p>helpdesk.mail_not_sent.message</p>
        <p>helpdesk.try_again.message</p>
      </div>
      <p><a routerlink="/home">helpdesk.contactus.continueshopping</a></p>
    `);
  });
});
