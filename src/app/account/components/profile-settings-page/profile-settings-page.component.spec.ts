import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Customer } from '../../../models/customer/customer.model';
import { MockComponent } from '../../../utils/dev/mock.component';
import { ProfileSettingsPageComponent } from './profile-settings-page.component';

describe('Profile Settings Page Component', () => {
  let component: ProfileSettingsPageComponent;
  let fixture: ComponentFixture<ProfileSettingsPageComponent>;
  let element: HTMLElement;
  const customer = {
    firstName: 'Patricia',
    lastName: 'Miller',
    title: '',
    credentials: {
      login: '',
    },
  } as Customer;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          ProfileSettingsPageComponent,
          MockComponent({
            selector: 'ish-breadcrumb',
            template: 'Breadcrumb Component',
            inputs: ['account', 'trailText'],
          }),
          MockComponent({
            selector: 'ish-account-navigation',
            template: 'Account Navigation Component',
          }),
        ],
        imports: [TranslateModule.forRoot()],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSettingsPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.customer = customer;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
