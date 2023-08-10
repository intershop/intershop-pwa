import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { CMSFacade } from 'ish-core/facades/cms.facade';
import { PreviewService } from 'ish-core/utils/preview/preview.service';

import { ContentDesignviewWrapperComponent } from './content-designview-wrapper.component';

describe('Content Designview Wrapper Component', () => {
  let component: ContentDesignviewWrapperComponent;
  let fixture: ComponentFixture<ContentDesignviewWrapperComponent>;
  let element: HTMLElement;
  let cmsFacade: CMSFacade;
  let previewService: PreviewService;

  beforeEach(async () => {
    cmsFacade = mock(CMSFacade);
    previewService = mock(PreviewService);

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [ContentDesignviewWrapperComponent, MockComponent(FaIconComponent)],
      providers: [
        { provide: CMSFacade, useFactory: () => instance(cmsFacade) },
        { provide: PreviewService, useFactory: () => instance(previewService) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentDesignviewWrapperComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
