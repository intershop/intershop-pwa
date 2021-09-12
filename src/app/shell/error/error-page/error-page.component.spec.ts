import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ErrorComponent } from 'ish-shell/error/error/error.component';
import { ServerErrorComponent } from 'ish-shell/error/server-error/server-error.component';

import { ErrorPageComponent } from './error-page.component';

describe('Error Page Component', () => {
  let component: ErrorPageComponent;
  let fixture: ComponentFixture<ErrorPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorPageComponent, MockComponent(ErrorComponent), MockComponent(ServerErrorComponent)],
      providers: [{ provide: AppFacade, useFactory: () => instance(mock(AppFacade)) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
