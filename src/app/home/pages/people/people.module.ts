import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { PeopleComponent } from './people.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [IonicModule, RouterModule.forChild([{ path: '', component: PeopleComponent }])],
  declarations: [PeopleComponent],
  exports: [PeopleComponent],
})
export class PeopleModule { }
