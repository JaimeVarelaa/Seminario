import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddChildComponent } from './add-children/add-children.component';
import { NiñoService } from 'src/app/services/niño-service.service';
import { Niño } from 'src/models/adulto.model';

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.scss'],
})
export class ChildrenComponent implements OnInit {
  nino: Niño = this.createEmptyNiño();

  ninos: Niño[] = [];

  constructor(
    private modalController: ModalController,
    private niñoService: NiñoService,
  ) { }

  ngOnInit() {
    setTimeout(async () => {
      this.ninos = await this.niñoService.getNiños();
      console.log(this.ninos)
    }, 3000);
  }

  createEmptyNiño() {
    return {
      id: 0,
      nombres: '',
      apellido_paterno: '',
      apellido_materno: '',
      edad: 0,
      fecha_nac: new Date().toISOString(),
      foto: '',
      deseo: '',
    };
  }

  resetAdulto() {
    this.nino = this.createEmptyNiño();
  }

  handleRefresh(event) {
    setTimeout(async () => {
      this.ninos = await this.niñoService.getNiños();
      event.target.complete();
    }, 0);
  }

  async openFormChild() {
    const modal = await this.modalController.create({
      component: AddChildComponent,
      componentProps: {
        nino: this.nino,
        nuevo: true,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        console.log('Modal aceptado:', result.data);
      } else {
        console.log('Modal cerrado sin aceptar');
      }

      this.nino = this.createEmptyNiño();
    });

    await modal.present();
  }

  async openEditFormPeople(nino: Niño) {
    try {
      const partesFecha = nino.fecha_nac.split('/');
      nino.fecha_nac = new Date(
        `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`
      ).toISOString();
    } catch (e) { }
    const modal = await this.modalController.create({
      component: AddChildComponent,
      componentProps: {
        nino: nino,
        nuevo: false,
      },
    });
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        console.log('Modal aceptado:', result.data);
      } else {
        console.log('Modal cerrado sin aceptar');
      }

      this.nino = this.createEmptyNiño();
    });

    await modal.present();
  }

  async deleteNino(nino: Niño) {
    const result = await this.niñoService.deleteNiño(nino.id);

    if (result) {
      console.log('Adulto eliminado con éxito');
      this.ninos = this.ninos.filter(a => a.id !== nino.id);
    } else {
      console.log('Hubo un error al eliminar al adulto');
    }
  }

}
