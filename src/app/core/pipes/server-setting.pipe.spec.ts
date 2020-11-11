import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { concat, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { anything, instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';

import { ServerSettingPipe } from './server-setting.pipe';

@Component({
  template: `<ng-container *ngIf="'service.ABC.runnable' | ishServerSetting">TEST</ng-container>
    <ng-container *ngIf="'always' | ishServerSetting">[always]</ng-container>
    <ng-container *ngIf="'never' | ishServerSetting">[never]</ng-container>`,
})
class TestComponent {}

describe('Server Setting Pipe', () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;
  let appFacade: AppFacade;

  beforeEach(async () => {
    appFacade = mock(AppFacade);
    TestBed.configureTestingModule({
      declarations: [ServerSettingPipe, TestComponent],
      providers: [{ provide: AppFacade, useFactory: () => instance(appFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    element = fixture.nativeElement;
  });

  it('should render TEST when setting is set', () => {
    when(appFacade.serverSetting$('service.ABC.runnable')).thenReturn(of(true));
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`TEST[always]`);
  });

  it('should render TEST when setting is set to anything truthy', () => {
    when(appFacade.serverSetting$('service.ABC.runnable')).thenReturn(of('ABC'));
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`TEST[always]`);
  });

  it('should render nothing when setting is not set', () => {
    when(appFacade.serverSetting$(anything())).thenReturn(of(undefined));
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`[always]`);
  });

  it('should render nothing when setting is set to sth falsy', () => {
    when(appFacade.serverSetting$(anything())).thenReturn(of(''));
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`[always]`);
  });

  it('should render TEST when setting is set', fakeAsync(() => {
    when(appFacade.serverSetting$('service.ABC.runnable')).thenReturn(concat(of(false), of(true).pipe(delay(1000))));
    fixture.detectChanges();

    expect(element).toMatchInlineSnapshot(`[always]`);
    tick(1000);

    fixture.detectChanges();
    expect(element).toMatchInlineSnapshot(`TEST[always]`);
  }));
});
