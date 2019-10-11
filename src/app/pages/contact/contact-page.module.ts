import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContactStoreModule } from 'ish-core/store/contact/contact-store.module';
import { SharedModule } from 'ish-shared/shared.module';

import { ContactConfirmationComponent } from './components/contact-confirmation/contact-confirmation.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { ContactPageContainerComponent } from './contact-page.container';

const contactPageRoutes: Routes = [{ path: '', component: ContactPageContainerComponent }];

@NgModule({
  imports: [ContactStoreModule, RouterModule.forChild(contactPageRoutes), SharedModule],
  declarations: [ContactConfirmationComponent, ContactFormComponent, ContactPageContainerComponent],
})
export class ContactPageModule {}
