import { Component, OnInit } from '@angular/core';
import { NiñoService } from 'src/app/services/niño-service.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  constructor(
    private niñoSerice: NiñoService,) {
  }

  ngOnInit() { }

  exportData() {
    console.log(this.niñoSerice.generateJson())
  }

}
