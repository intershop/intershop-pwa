import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from 'ish-core/icon.module';

import { SearchBoxComponent } from './components/search-box/search-box.component';
import { SearchBoxContainerComponent } from './containers/search-box/search-box.container';

@NgModule({
  imports: [CommonModule, IconModule, ReactiveFormsModule, TranslateModule],
  declarations: [SearchBoxComponent, SearchBoxContainerComponent],
  exports: [SearchBoxContainerComponent],
})
export class SearchBoxSharedModule {}
