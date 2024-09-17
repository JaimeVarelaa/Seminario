import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { SettingsComponent } from './settings.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [IonicModule, RouterModule.forChild([{ path: '', component: SettingsComponent }])],
  declarations: [SettingsComponent],
  exports: [SettingsComponent],
})
export class SettingsModule { }
