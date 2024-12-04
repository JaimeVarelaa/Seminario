import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { ChildrenComponent } from './children.component';
import { AddChildComponent } from './add-children/add-children.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: ChildrenComponent }])
  ],
  declarations: [ChildrenComponent, AddChildComponent],
  exports: [ChildrenComponent],
})
export class ChildrenModule {}
