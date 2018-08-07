import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '../../../core/icon.module';
import { User } from '../../../models/user/user.model';
import { ProfileSettingsPageComponent } from './profile-settings-page.component';

describe('Profile Settings Page Component', () => {
  let component: ProfileSettingsPageComponent;
  let fixture: ComponentFixture<ProfileSettingsPageComponent>;
  let element: HTMLElement;
  const user = { firstName: 'Patricia', lastName: 'Miller' } as User;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileSettingsPageComponent],
      imports: [TranslateModule.forRoot(), IconModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSettingsPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.user = user;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
