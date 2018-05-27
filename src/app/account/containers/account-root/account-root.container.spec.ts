import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';
import { instance, mock } from 'ts-mockito';
import { MockComponent } from '../../../utils/dev/mock.component';
import { AccountRootContainerComponent } from './account-root.container';

describe('Account Root Container', () => {
  let fixture: ComponentFixture<AccountRootContainerComponent>;
  let component: AccountRootContainerComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountRootContainerComponent,
        MockComponent({
          selector: 'ish-breadcrumb',
          template: 'Breadcrumb Component',
          inputs: ['account', 'trailText'],
        }),
      ],
      providers: [
        { provide: Store, useFactory: () => instance(mock(Store)) },
        { provide: ActivatedRoute, useValue: { firstChild: { data: EMPTY } } },
      ],
      imports: [TranslateModule.forRoot(), RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountRootContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
