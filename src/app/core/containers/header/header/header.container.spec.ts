import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { combineReducers, StoreModule } from '@ngrx/store';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { errorReducer } from '../../../store/error/error.reducer';
import { HeaderContainerComponent } from './header.container';

describe('Header Container', () => {
  let component: HeaderContainerComponent;
  let fixture: ComponentFixture<HeaderContainerComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          error: combineReducers(errorReducer),
        }),
        RouterTestingModule,
      ],
      declarations: [
        HeaderContainerComponent,
        MockComponent({ selector: 'ish-header', template: 'Header Component' }),
        MockComponent({ selector: 'ish-simple-header', template: 'Simple Header Component' }),
        MockComponent({ selector: 'ish-header-checkout', template: 'Checkout Header Component' }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderContainerComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render default header component if no headerType is set', () => {
    fixture.detectChanges();
    expect(element.getElementsByTagName('ish-header')[0].textContent).toContain('Header Component');
  });
});
