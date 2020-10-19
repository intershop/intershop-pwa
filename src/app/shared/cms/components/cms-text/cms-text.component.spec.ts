import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { instance, mock } from 'ts-mockito';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { AppFacade } from 'ish-core/facades/app.facade';
import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';

import { CMSTextComponent } from './cms-text.component';

describe('Cms Text Component', () => {
  let component: CMSTextComponent;
  let fixture: ComponentFixture<CMSTextComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CMSTextComponent, ServerHtmlDirective],
      providers: [
        { provide: AppFacade, useFactory: () => instance(mock(AppFacade)) },
        { provide: APP_BASE_HREF, useValue: '/' },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CMSTextComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`N/A`);
  });

  it('should render html text pagelet if set', () => {
    const pagelet = {
      id: 'id',
      definitionQualifiedName: 'fq',
      displayName: 'name',
      domain: 'domain',
      configurationParameters: { HTMLText: 'foo' },
    };
    component.pagelet = createContentPageletView(pagelet);

    expect(() => fixture.detectChanges()).not.toThrow();
    expect(element).toMatchInlineSnapshot(`<span>foo</span>`);
  });
});
