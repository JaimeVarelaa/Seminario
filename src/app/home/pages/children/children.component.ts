import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';
import { AddChildComponent } from './add-children/add-children.component';
import { Niño } from 'src/models/adulto.model';

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.scss'],
})
export class ChildrenComponent implements OnInit {
  niño: Niño = this.createEmptyNiño();

  niños: Niño[] = [];

  constructor(
    private modalController: ModalController,
    private sqliteService: SqliteService
  ) {}

  ngOnInit() {
    setTimeout(async () => {}, 3000);
  }

  createEmptyNiño() {
    return {
      id: 0,
      nombres: '',
      apellido_paterno: '',
      apellido_materno: '',
      edad: 0,
      fecha_nac: '',
      foto: '',
      deseo: '',
    };
  }

  resetAdulto() {
    this.niño = this.createEmptyNiño();
  }

  handleRefresh(event) {
    setTimeout(() => {
      event.target.complete();
    }, 0);
  }

  async openFormChild() {
    const modal = await this.modalController.create({
      component: AddChildComponent,
      componentProps: {
        nino: this.niño,
        nuevo: true,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        console.log('Modal aceptado:', result.data);
      } else {
        console.log('Modal cerrado sin aceptar');
      }

      this.niño = this.createEmptyNiño();
    });

    await modal.present();
  }

  async openEditFormPeople(niño: Niño) {
    try {
      const partesFecha = niño.fecha_nac.split('/');
      niño.fecha_nac = new Date(
        `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`
      ).toISOString();
    } catch (e) {}
    const modal = await this.modalController.create({
      component: AddChildComponent,
      componentProps: {
        niño: niño,
        nuevo: false,
      },
    });
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        console.log('Modal aceptado:', result.data);
      } else {
        console.log('Modal cerrado sin aceptar');
      }

      this.niño = this.createEmptyNiño();
    });

    await modal.present();
  }
}
