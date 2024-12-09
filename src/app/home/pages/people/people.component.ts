import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddPeopleComponent } from './add-people/add-people.component';
import { Adulto } from 'src/models/adulto.model';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
})

export class PeopleComponent implements OnInit {

  adulto: Adulto = this.createEmptyAdulto();

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() { }

  createEmptyAdulto(): Adulto {
    return {
      nombres: '',
      apeliido_paterno: '',
      apellido_materno: '',
      edad: 0,
      fecha_nac: new Date().toISOString(),
      foto: '',
      contacto: {
        numero: ''
      },
      direccion: {
        calle: '',
        numero: 0,
        colonia: '',
        cp: 0,
        municipio: '',
        estado: '',
        referencia: '',
      }
    };
  }

  resetAdulto(): void {
    this.adulto = this.createEmptyAdulto();
  }

  handleRefresh(event) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  async openFormPeople() {
    const modal = await this.modalController.create({
      component: AddPeopleComponent,
      componentProps: {
        adulto: this.adulto
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        console.log('Modal aceptado:', result.data);
      } else {
        console.log('Modal cerrado sin aceptar');
        this.adulto = this.createEmptyAdulto();
      }
    });

    await modal.present();
  }
}
