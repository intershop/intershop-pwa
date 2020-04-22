import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { coreReducers } from 'ish-core/store/core-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { QuickorderPageComponent } from './quickorder-page.component';

describe('Quickorder Page Component', () => {
  let component: QuickorderPageComponent;
  let fixture: ComponentFixture<QuickorderPageComponent>;
  let element: HTMLElement;
  let store$: TestStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot(), ngrxTesting({ reducers: coreReducers })],
      declarations: [MockComponent(BreadcrumbComponent), MockComponent(InputComponent), QuickorderPageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickorderPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    store$ = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(store$).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should be always initialized with numberOfRows quick order lines', () => {
    fixture.detectChanges();

    expect(component.quickOrderlines).toHaveLength(component.numberOfRows);
  });

  it('should always delete one line', () => {
    fixture.detectChanges();
    component.deleteItem(0);
    expect(component.quickOrderlines).toHaveLength(component.numberOfRows - 1);
  });

  it('should always add one line', () => {
    fixture.detectChanges();
    component.addRows(1);
    expect(component.quickOrderlines).toHaveLength(component.numberOfRows + 1);
  });
});
