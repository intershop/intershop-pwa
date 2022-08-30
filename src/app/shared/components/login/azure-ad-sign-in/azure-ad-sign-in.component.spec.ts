import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AzureADSignInComponent } from './azure-ad-sign-in.component';

describe('Azure Ad Sign In Component', () => {
  let component: AzureADSignInComponent;
  let fixture: ComponentFixture<AzureADSignInComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AzureADSignInComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
