import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddPeopleComponent } from './add-people/add-people.component';
import { Adulto } from 'src/models/adulto.model';
import { AdultoService } from 'src/app/services/adulto.service.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
})
export class PeopleComponent implements OnInit {
  adulto: Adulto = this.createEmptyAdulto();

  adultos: Adulto[] = [];

  constructor(
    private modalController: ModalController,
    private adultoService: AdultoService
  ) {}

  async ngOnInit() {
    setTimeout(async () => {
      this.adultos = await this.adultoService.getAdultos();
    }, 3000);
  }

  createEmptyAdulto(): Adulto {
    return {
      nombres: '',
      apeliido_paterno: '',
      apellido_materno: '',
      edad: 0,
      fecha_nac: new Date().toISOString(),
      foto: '',
      contacto: {
        numero: '',
      },
      direccion: {
        calle: '',
        numero: 0,
        colonia: '',
        cp: 0,
        municipio: '',
        estado: '',
        referencia: '',
      },
      estudio: {
        vivienda: '',
        techo: '',
        piso: '',
        num_habitaciones: '',
        combustible: '',
        num_habitantes: '',
        enfermos_cronicos: '',
        num_trabajadores: '',
      },
    };
  }

  resetAdulto(): void {
    this.adulto = this.createEmptyAdulto();
  }

  handleRefresh(event) {
    setTimeout(async () => {
      this.adultos = await this.adultoService.getAdultos();
      event.target.complete();
    }, 0);
  }

  async openFormPeople() {
    const modal = await this.modalController.create({
      component: AddPeopleComponent,
      componentProps: {
        adulto: this.adulto,
        nuevo: true,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        console.log('Modal aceptado:', result.data);
      } else {
        console.log('Modal cerrado sin aceptar');
      }

      this.adulto = this.createEmptyAdulto();
    });

    await modal.present();
  }

  async openEditFormPeople(adulto: Adulto) {
    try {
      const partesFecha = adulto.fecha_nac.split('/');
      adulto.fecha_nac = new Date(
        `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`
      ).toISOString();
    } catch (e) {}
    const modal = await this.modalController.create({
      component: AddPeopleComponent,
      componentProps: {
        adulto: adulto,
        nuevo: false,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        console.log('Modal aceptado:', result.data);
      } else {
        console.log('Modal cerrado sin aceptar');
      }

      this.adulto = this.createEmptyAdulto();
    });

    await modal.present();
  }

  async deleteAdulto(adulto: Adulto) {
    const result = await this.adultoService.deleteAdulto(adulto.id);
  
    if (result) {
      console.log('Adulto eliminado con éxito');
      this.adultos = this.adultos.filter(a => a.id !== adulto.id);
    } else {
      console.log('Hubo un error al eliminar al adulto');
    }
  }
  
}
