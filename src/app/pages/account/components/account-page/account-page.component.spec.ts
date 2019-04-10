import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';

import { AccountNavigationComponent } from '../account-navigation/account-navigation.component';

import { AccountPageComponent } from './account-page.component';

describe('Account Page Component', () => {
  let fixture: ComponentFixture<AccountPageComponent>;
  let element: HTMLElement;
  let component: AccountPageComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AccountPageComponent, MockComponent(AccountNavigationComponent)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
