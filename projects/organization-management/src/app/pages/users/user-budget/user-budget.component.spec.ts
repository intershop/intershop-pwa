import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { UserBudgetComponent } from './user-budget.component';

describe('UserBudgetComponent', () => {
  let component: UserBudgetComponent;
  let fixture: ComponentFixture<UserBudgetComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserBudgetComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBudgetComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
