import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from 'ish-core/icon.module';

import { SearchBoxComponent } from './search/components/search-box/search-box.component';
import { SearchBoxContainerComponent } from './search/containers/search-box/search-box.container';

@NgModule({
  imports: [CommonModule, IconModule, ReactiveFormsModule, TranslateModule],
  declarations: [SearchBoxComponent, SearchBoxContainerComponent],
  exports: [SearchBoxComponent, SearchBoxContainerComponent],
})
export class SharedSearchModule {}
