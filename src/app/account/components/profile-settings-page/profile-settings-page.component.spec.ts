import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from 'ish-core/icon.module';
import { User } from 'ish-core/models/user/user.model';

import { ProfileSettingsPageComponent } from './profile-settings-page.component';

describe('Profile Settings Page Component', () => {
  let component: ProfileSettingsPageComponent;
  let fixture: ComponentFixture<ProfileSettingsPageComponent>;
  let element: HTMLElement;
  const user = { firstName: 'Patricia', lastName: 'Miller' } as User;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileSettingsPageComponent],
      imports: [IconModule, TranslateModule.forRoot()],
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
