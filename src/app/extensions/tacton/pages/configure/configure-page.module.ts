import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TactonModule } from '../../tacton.module';

import { ConfigurePageComponent } from './configure-page.component';
import { TactonBomComponent } from './tacton-bom/tacton-bom.component';
import { TactonGroupComponent } from './tacton-group/tacton-group.component';
import { TactonNumberInputComponent } from './tacton-number-input/tacton-number-input.component';
import { TactonRadioInputComponent } from './tacton-radio-input/tacton-radio-input.component';
import { TactonReadonlyComponent } from './tacton-readonly/tacton-readonly.component';
import { TactonSelectInputComponent } from './tacton-select-input/tacton-select-input.component';
import { TactonTextInputComponent } from './tacton-text-input/tacton-text-input.component';

const configurePageRoutes: Routes = [
  { path: ':sku/:mainStep/:firstStep', component: ConfigurePageComponent },
  { path: ':sku', component: ConfigurePageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(configurePageRoutes), TactonModule],
  declarations: [
    ConfigurePageComponent,
    TactonBomComponent,
    TactonGroupComponent,
    TactonNumberInputComponent,
    TactonRadioInputComponent,
    TactonReadonlyComponent,
    TactonSelectInputComponent,
    TactonTextInputComponent,
  ],
})
export class ConfigurePageModule {}
