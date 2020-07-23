import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TactonModule } from '../../tacton.module';

import { ConfigurePageComponent } from './configure-page.component';
import { TactonBomComponent } from './tacton-bom/tacton-bom.component';
import { TactonConfigureNavigationComponent } from './tacton-configure-navigation/tacton-configure-navigation.component';
import { TactonGroupComponent } from './tacton-group/tacton-group.component';
import { TactonImageTextButtonsComponent } from './tacton-image-text-buttons/tacton-image-text-buttons.component';
import { TactonNumberInputComponent } from './tacton-number-input/tacton-number-input.component';
import { TactonRadioInputComponent } from './tacton-radio-input/tacton-radio-input.component';
import { TactonReadonlyComponent } from './tacton-readonly/tacton-readonly.component';
import { TactonSelectInputComponent } from './tacton-select-input/tacton-select-input.component';
import { TactonSelectedImageComponent } from './tacton-selected-image/tacton-selected-image.component';
import { TactonStepButtonsComponent } from './tacton-step-buttons/tacton-step-buttons.component';
import { TactonTextButtonsComponent } from './tacton-text-buttons/tacton-text-buttons.component';
import { TactonTextInputComponent } from './tacton-text-input/tacton-text-input.component';

const configurePageRoutes: Routes = [
  { path: ':sku/:mainStep', component: ConfigurePageComponent },
  { path: ':sku', component: ConfigurePageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(configurePageRoutes), TactonModule],
  declarations: [
    ConfigurePageComponent,
    TactonBomComponent,
    TactonConfigureNavigationComponent,
    TactonGroupComponent,
    TactonImageTextButtonsComponent,
    TactonNumberInputComponent,
    TactonRadioInputComponent,
    TactonReadonlyComponent,
    TactonSelectInputComponent,
    TactonSelectedImageComponent,
    TactonStepButtonsComponent,
    TactonTextButtonsComponent,
    TactonTextInputComponent,
  ],
})
export class ConfigurePageModule {}
