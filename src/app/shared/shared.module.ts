import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AccordionItemComponent } from './components/accordion-item/accordion-item.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import { FeatureToggleModule } from './feature-toggle.module';
import { PipesModule } from './pipes.module';

@NgModule({
  imports: [
    RouterModule,
    TranslateModule,
    CommonModule,
    BsDropdownModule,
    CarouselModule,
    CollapseModule,
    ModalModule,
    PopoverModule,
    PipesModule,
    FeatureToggleModule,
    InfiniteScrollModule,
  ],
  declarations: [
    BreadcrumbComponent,
    ModalDialogComponent,
    LoadingComponent,
    LoadingSpinnerComponent,
    AccordionComponent,
    AccordionItemComponent,
  ],
  exports: [
    RouterModule,
    TranslateModule,
    CommonModule,
    BsDropdownModule,
    CarouselModule,
    CollapseModule,
    ModalModule,
    PopoverModule,
    BreadcrumbComponent,
    LoadingComponent,
    LoadingSpinnerComponent,
    ModalDialogComponent,
    AccordionComponent,
    AccordionItemComponent,
    PipesModule,
    FeatureToggleModule,
    InfiniteScrollModule,
  ],
})
export class SharedModule {}
