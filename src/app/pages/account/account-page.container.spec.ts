import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { EMPTY } from 'rxjs';

import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { AccountPageContainerComponent } from './account-page.container';
import { AccountPageComponent } from './components/account-page/account-page.component';

describe('Account Page Container', () => {
  let fixture: ComponentFixture<AccountPageContainerComponent>;
  let component: AccountPageContainerComponent;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountPageContainerComponent, MockComponent(AccountPageComponent)],
      providers: [{ provide: ActivatedRoute, useValue: { firstChild: { data: EMPTY } } }],
      imports: [RouterTestingModule, TranslateModule.forRoot(), ngrxTesting()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
