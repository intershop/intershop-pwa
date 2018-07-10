import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../../../models/user/user.model';
import { LogoutComponent } from './logout.component';

describe('Logout Component', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [LogoutComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render logout link if user is logged in', () => {
    component.user = { firstName: 'John' } as User;

    fixture.detectChanges();
    expect(element.querySelector('a[data-testing-id=link-logout]')).toBeTruthy();
  });

  it('should not render logout link if user is not logged in', () => {
    component.user = null;

    fixture.detectChanges();
    expect(element.querySelector('a[data-testing-id=link-logout]')).toBeFalsy();
  });
});
