import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileSettingsPageComponent } from './profile-settings-page.component';

describe('Profile Settings Page Component', () => {
  let component: ProfileSettingsPageComponent;
  let fixture: ComponentFixture<ProfileSettingsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileSettingsPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
