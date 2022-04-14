import { ComponentFixture, TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { StoreLocatorFacade } from '../../facades/store-locator.facade';

import { StoresMapComponent } from './stores-map.component';

describe('Stores Map Component', () => {
  let component: StoresMapComponent;
  let fixture: ComponentFixture<StoresMapComponent>;
  let element: HTMLElement;
  const storeLocatorFacade = mock(StoreLocatorFacade);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: StoreLocatorFacade, useFactory: () => instance(storeLocatorFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoresMapComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
