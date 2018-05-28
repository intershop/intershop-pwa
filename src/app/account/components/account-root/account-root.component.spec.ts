import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from '../../../utils/dev/mock.component';
import { AccountRootComponent } from './account-root.component';

describe('Account Root Component', () => {
  let fixture: ComponentFixture<AccountRootComponent>;
  let element: HTMLElement;
  let component: AccountRootComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        AccountRootComponent,
        MockComponent({
          selector: 'ish-account-navigation',
          template: 'Account Navigation Component',
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountRootComponent);
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
