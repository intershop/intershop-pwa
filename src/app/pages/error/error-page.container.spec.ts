import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';

import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';

import { ErrorComponent } from './components/error/error.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { ErrorPageContainerComponent } from './error-page.container';

describe('Error Page Container', () => {
  let component: ErrorPageContainerComponent;
  let fixture: ComponentFixture<ErrorPageContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorPageContainerComponent, MockComponent(ErrorComponent), MockComponent(ServerErrorComponent)],
      imports: [RouterTestingModule, ngrxTesting()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorPageContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
