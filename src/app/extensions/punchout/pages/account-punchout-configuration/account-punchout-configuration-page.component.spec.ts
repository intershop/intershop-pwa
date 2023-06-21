import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { AccountPunchoutConfigurationPageComponent } from './account-punchout-configuration-page.component';
import { OciConfigurationFormComponent } from './oci-configuration-form/oci-configuration-form.component';

describe('Account Punchout Configuration Page Component', () => {
  let component: AccountPunchoutConfigurationPageComponent;
  let fixture: ComponentFixture<AccountPunchoutConfigurationPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [AccountPunchoutConfigurationPageComponent, MockComponent(OciConfigurationFormComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPunchoutConfigurationPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
