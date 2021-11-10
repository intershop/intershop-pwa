import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { InfoMessageComponent } from 'ish-shared/components/common/info-message/info-message.component';

import { AccountPunchoutHeaderComponent } from './account-punchout-header.component';

describe('Account Punchout Header Component', () => {
  let component: AccountPunchoutHeaderComponent;
  let fixture: ComponentFixture<AccountPunchoutHeaderComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbNavModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        AccountPunchoutHeaderComponent,
        MockComponent(ErrorMessageComponent),
        MockComponent(InfoMessageComponent),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPunchoutHeaderComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.punchoutTypes = ['oci', 'cxml'];
    component.selectedType = 'cxml';
    const translate = TestBed.inject(TranslateService);
    translate.setDefaultLang('en');
    translate.use('en');
    translate.set('account.punchout.type.text', '{{0}}');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display tabs for all punchoutTypes', () => {
    fixture.detectChanges();

    expect(element.querySelectorAll('.nav-tabs li')).toHaveLength(2);
  });

  it('should display the selected type as active after init', () => {
    fixture.detectChanges();

    expect(element.querySelector('.nav-tabs .active').textContent).toMatchInlineSnapshot(`"cxml"`);
  });

  it('should not display tabs if there are less than 2 types', () => {
    component.punchoutTypes = ['cxml'];
    fixture.detectChanges();

    expect(element.querySelector('.nav-tabs')).toBeFalsy();
  });

  it('should display an info message if there are no types-header', () => {
    component.punchoutTypes = [];
    fixture.detectChanges();

    expect(element.querySelector('ish-info-message')).toBeTruthy();
    expect(element.querySelector('.nav-tabs')).toBeFalsy();
  });
});
