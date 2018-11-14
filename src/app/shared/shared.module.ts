import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  NgbCarouselModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { IconModule } from 'ish-core/icon.module';
import { PipesModule } from 'ish-core/pipes.module';

import { AccordionItemComponent } from './components/common/accordion-item/accordion-item.component';
import { AccordionComponent } from './components/common/accordion/accordion.component';
import { BreadcrumbComponent } from './components/common/breadcrumb/breadcrumb.component';
import { InfoBoxComponent } from './components/common/info-box/info-box.component';
import { LoadingComponent } from './components/common/loading/loading.component';
import { ModalDialogComponent } from './components/common/modal-dialog/modal-dialog.component';

const importExportModules = [
  CommonModule,
  FeatureToggleModule,
  IconModule,
  InfiniteScrollModule,
  NgbCarouselModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModalModule,
  NgbPopoverModule,
  PipesModule,
  RouterModule,
  TranslateModule,
];

const exportedComponents = [
  AccordionComponent,
  AccordionItemComponent,
  BreadcrumbComponent,
  InfoBoxComponent,
  LoadingComponent,
  ModalDialogComponent,
];

@NgModule({
  imports: [...importExportModules],
  declarations: [...exportedComponents],
  exports: [...exportedComponents, ...importExportModules],
})
export class SharedModule {}
