import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompareDetailsComponent } from './shared/components/header/productCompare/compareDetails.component';

const routes: Routes = [
  { path: '', redirectTo: 'familyPage', pathMatch: 'full' },

  { path: 'familyPage/compare/:id', component: CompareDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
export const routingComponents = []
