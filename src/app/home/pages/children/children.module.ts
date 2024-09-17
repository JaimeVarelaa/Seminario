import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { ChildrenComponent } from './children.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [IonicModule, RouterModule.forChild([{ path: '', component: ChildrenComponent }])],
  declarations: [ChildrenComponent],
  exports: [ChildrenComponent],
})
export class ChildrenModule { }
