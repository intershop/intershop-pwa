import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { TactonFacade } from '../../../facades/tacton.facade';
import { TactonNavigationTree } from '../../../models/tacton-navigation-tree/tacton-navigation-tree.model';

import { TactonConfigureNavigationComponent } from './tacton-configure-navigation.component';

describe('Tacton Configure Navigation Component', () => {
  let component: TactonConfigureNavigationComponent;
  let fixture: ComponentFixture<TactonConfigureNavigationComponent>;
  let element: HTMLElement;
  let tactonFacade: TactonFacade;
  const tree: TactonNavigationTree = [
    {
      name: 'step1',
      description: 'step 1 description',
      active: true,
      children: [
        { name: 'step11', description: 'step 1.1 description', active: false },
        { name: 'step12', description: 'step 1.2 description', active: false },
      ],
    },
    { name: 'step2', description: 'step 2 description', active: false },
  ];

  beforeEach(async(() => {
    tactonFacade = mock(TactonFacade);

    TestBed.configureTestingModule({
      declarations: [TactonConfigureNavigationComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: TactonFacade, useFactory: () => instance(tactonFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TactonConfigureNavigationComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
  it('should render for group-level navigation', () => {
    when(tactonFacade.configurationTree$).thenReturn(of(tree));

    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`
      <ul class="list-unstyled bg-light p-3">
        <li class="pt-1 pb-1">
          <a class="font-weight-bold">step 1 description</a>
          <ul class="list-unstyled pl-3">
            <li class="pt-1 pb-1">
              <a ng-reflect-fragment="step11" ng-reflect-router-link="" href="/#step11"
                >step 1.1 description</a
              >
            </li>
            <li class="pt-1 pb-1">
              <a ng-reflect-fragment="step12" ng-reflect-router-link="" href="/#step12"
                >step 1.2 description</a
              >
            </li>
          </ul>
        </li>
        <li class="pt-1 pb-1"><a>step 2 description</a></li>
      </ul>
    `);
  });
});
