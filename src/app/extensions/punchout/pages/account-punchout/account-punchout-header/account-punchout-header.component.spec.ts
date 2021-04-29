import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

import { AccountPunchoutHeaderComponent } from './account-punchout-header.component';

describe('Account Punchout Header Component', () => {
  let component: AccountPunchoutHeaderComponent;
  let fixture: ComponentFixture<AccountPunchoutHeaderComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbNavModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [AccountPunchoutHeaderComponent, MockComponent(ErrorMessageComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPunchoutHeaderComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.punchoutTypes = ['oci', 'cxml'];
    component.selectedType = 'cxml';
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

    expect(element.querySelector('.nav-tabs .active').textContent).toMatchInlineSnapshot(
      `"account.punchout.cxml.text"`
    );
  });

  it('should not display tabs if there are less than 2 types', () => {
    component.punchoutTypes = ['cxml'];
    fixture.detectChanges();

    expect(element.querySelector('.nav-tabs')).toBeFalsy();
  });

  it('should display an info message if there are no types', () => {
    component.punchoutTypes = [];
    fixture.detectChanges();

    expect(element.querySelector('[data-testing-id="info-message"]')).toBeTruthy();
    expect(element.querySelector('.nav-tabs')).toBeFalsy();
  });
});
