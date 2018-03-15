import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { coreReducers } from '../../../core/store/core.system';
import { LoginUserSuccess } from '../../../core/store/user';
import { CustomerFactory } from '../../../models/customer/customer.factory';
import { CustomerData } from '../../../models/customer/customer.interface';
import { MockComponent } from '../../../utils/dev/mock.component';
import { ProfileSettingsPageContainerComponent } from './profile-settings-page.container';

describe('Profile Settings Page Container', () => {
  let component: ProfileSettingsPageContainerComponent;
  let fixture: ComponentFixture<ProfileSettingsPageContainerComponent>;
  let element: HTMLElement;
  const customer = CustomerFactory.fromData({
    'firstName': 'Patricia',
    'lastName': 'Miller',
    'title': '',
    'credentials': {
      'login': ''
    }
  } as CustomerData);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProfileSettingsPageContainerComponent,
        MockComponent({
          selector: 'ish-breadcrumb',
          template: 'Breadcrumb Component',
          inputs: ['account', 'trailText']
        }),
        MockComponent({
          selector: 'ish-profile-settings-page',
          template: 'Profile Settings Component',
          inputs: ['customer']
        })
      ],
      imports: [
        TranslateModule.forRoot(),
        StoreModule.forRoot(coreReducers)
      ]
    }).compileComponents().then(() => {
      TestBed.get(Store).dispatch(new LoginUserSuccess(customer));
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSettingsPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
