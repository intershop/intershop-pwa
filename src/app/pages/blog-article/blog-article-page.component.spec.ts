import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { CMSFacade } from 'ish-core/facades/cms.facade';

import { BlogArticlePageComponent } from './blog-article-page.component';

describe('Blog Article Page Component', () => {
  let component: BlogArticlePageComponent;
  let fixture: ComponentFixture<BlogArticlePageComponent>;
  let element: HTMLElement;
  let cmsFacade: CMSFacade;

  beforeEach(async () => {
    cmsFacade = mock(cmsFacade);
    when(cmsFacade.contentPagelet$).thenReturn(EMPTY);

    await TestBed.configureTestingModule({
      declarations: [BlogArticlePageComponent],
      providers: [{ provide: CMSFacade, useFactory: () => instance(cmsFacade) }],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogArticlePageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
