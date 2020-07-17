import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';

import { RequisitionsListComponent } from '../../components/requisitions-list/requisitions-list.component';

import { BuyerPageComponent } from './buyer-page.component';

describe('Buyer Page Component', () => {
  let component: BuyerPageComponent;
  let fixture: ComponentFixture<BuyerPageComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      declarations: [BuyerPageComponent, MockComponent(RequisitionsListComponent)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
