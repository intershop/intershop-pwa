import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { anything, capture, instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';
import { CategoriesActionTypes } from '../../../../shopping/store/categories';
import { MockComponent } from '../../../../utils/dev/mock.component';
import { CoreState } from '../../../store/user';
import { HeaderNavigationContainerComponent } from './header-navigation.container';

describe('Header Navigation Container', () => {
  let component: HeaderNavigationContainerComponent;
  let fixture: ComponentFixture<HeaderNavigationContainerComponent>;
  let element: HTMLElement;
  let storeMock: Store<CoreState>;

  beforeEach(async(() => {
    storeMock = mock(Store);
    when(storeMock.pipe(anything())).thenReturn(of({}) as any);

    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'ish-header-navigation',
          template: 'Header Navigation',
          inputs: ['categories'],
        }),
        HeaderNavigationContainerComponent,
      ],
      providers: [
        { provide: Store, useFactory: () => instance(storeMock) },
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(HeaderNavigationContainerComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(function() { fixture.detectChanges(); }).not.toThrow();
  });

  it('should retrieve categories when created', () => {
    verify(storeMock.dispatch(anything())).never();
    fixture.detectChanges();
    verify(storeMock.dispatch(anything())).once();
    const [param1] = capture(storeMock.dispatch).last();
    expect((<Action>param1).type).toBe(CategoriesActionTypes.LoadTopLevelCategories);
  });
});
