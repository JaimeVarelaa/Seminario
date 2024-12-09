import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ChildrenComponent } from './children.component';
import { RouterModule } from '@angular/router';
import { AddChildComponent } from './add-children/add-children.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild([{ path: '', component: ChildrenComponent }]),
  ],
  declarations: [ChildrenComponent, AddChildComponent],
  exports: [ChildrenComponent],
})
export class ChildrenModule {}
