import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ResourcesComponent } from './resources.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [IonicModule, RouterModule.forChild([{ path: '', component: ResourcesComponent }])],
  declarations: [ResourcesComponent],
  exports: [ResourcesComponent],
})
export class ResourcesModule { }
