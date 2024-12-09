import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PeopleComponent } from './people.component';
import { RouterModule } from '@angular/router';
import { AddPeopleComponent } from './add-people/add-people.component';

@NgModule({
  imports: [IonicModule, CommonModule, RouterModule.forChild([{ path: '', component: PeopleComponent }])],
  declarations: [PeopleComponent, AddPeopleComponent],
  exports: [PeopleComponent],
})
export class PeopleModule { }
