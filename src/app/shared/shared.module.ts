import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { AccordionItemComponent } from './components/accordion-item/accordion-item.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import { PipesModule } from './pipes.module';
import { AttributeToStringPipe } from './pipes/attribute.pipe';
import { PricePipe } from './pipes/price.pipe';

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
  ],
  declarations: [
    BreadcrumbComponent,
    ModalDialogComponent,
    LoadingComponent,
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
    ModalDialogComponent,
    AccordionComponent,
    AccordionItemComponent,
    AttributeToStringPipe,
    PricePipe,
  ],
})
export class SharedModule {}
