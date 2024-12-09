import { Component, Input } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, ModalController } from '@ionic/angular';
import { AdultoService } from 'src/app/services/adulto.service.service';
import { Adulto } from 'src/models/adulto.model';

@Component({
  selector: 'app-add-people',
  templateUrl: './add-people.component.html',
  styleUrls: ['./add-people.component.scss'],
})
export class AddPeopleComponent {
  @Input() adulto: Adulto;
  @Input() nuevo: boolean;

  currentStep = 1;
  steps = ['Foto', 'Datos', 'Dirección', 'Estudio'];

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private adultoService: AdultoService
  ) {}

  closeModal() {
    this.modalController.dismiss();
  }

  async acceptModal() {
    let result: boolean = false;
    this.adulto.fecha_nac = this.formatDateToDDMMYYYY(
      new Date(this.adulto.fecha_nac)
    );
    if (this.nuevo) {
      result = await this.adultoService.addAdulto(this.adulto);
    } else {
      result = await this.adultoService.updateAdulto(this.adulto);
    }
    if (result) {
      this.modalController.dismiss(this.adulto);
    } else {
      this.presentAlert(
        'Algo salió mal',
        'Error al insertar los datos en la base de datos.',
        'Por favor, inténtalo de nuevo o comunícate con soporte.'
      );
    }
  }

  goBack() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goNext() {
    if (this.currentStep < this.steps.length && this.checkStep()) {
      this.currentStep++;
    } else if (this.currentStep >= this.steps.length && this.checkStep()) {
      this.acceptModal();
    }
  }

  goToStep(step: number) {
    //this.currentStep = step;
  }

  public alertButtons = ['Aceptar'];
  async presentAlert(header: string, subHeader: string, campo: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: campo,
      buttons: this.alertButtons,
    });

    await alert.present();
  }

  checkStep(): boolean {
    let campos: string = '';
    switch (this.currentStep) {
      case 1:
        if (!this.adulto.foto) {
          campos += 'Foto, ';
        }
        break;

      case 2:
        if (this.adulto.nombres === '') {
          campos += 'Nombres, ';
        }
        if (this.adulto.apeliido_paterno === '') {
          campos += 'Apellido Paterno, ';
        }
        if (this.adulto.apellido_materno === '') {
          campos += 'Apellido Materno, ';
        }
        if (this.adulto.edad === 0) {
          campos += 'Edad, ';
        }
        if (this.adulto.contacto.numero === '') {
          campos += 'Teléfono, ';
        }
        break;

      case 3:
        if (this.adulto.direccion.calle === '') {
          campos += 'Calle, ';
        }
        if (this.adulto.direccion.numero === 0) {
          campos += 'Número, ';
        }
        if (this.adulto.direccion.colonia === '') {
          campos += 'Colonia, ';
        }
        if (this.adulto.direccion.cp === 0) {
          campos += 'Código Postal, ';
        }
        if (this.adulto.direccion.municipio === '') {
          campos += 'Municipio, ';
        }
        if (this.adulto.direccion.estado === '') {
          campos += 'Estado, ';
        }
        if (this.adulto.direccion.referencia === '') {
          campos += 'Referencia, ';
        }
        break;

      case 4:
        if (this.adulto.estudio.vivienda === '') {
          campos += 'Estado de la vivienda, ';
        }
        if (this.adulto.estudio.techo === '') {
          campos += 'Material del techo, ';
        }
        if (this.adulto.estudio.piso === '') {
          campos += 'Material del piso, ';
        }
        if (this.adulto.estudio.num_habitaciones === '') {
          campos += 'Número de habitaciones, ';
        }
        if (this.adulto.estudio.combustible === '') {
          campos += 'Combustible para cocinar, ';
        }
        if (this.adulto.estudio.num_habitantes === '') {
          campos += 'Número de habitantes, ';
        }
        if ((this, this.adulto.estudio.num_trabajadores === '')) {
          campos += 'Números de trabajadores, ';
        }
    }
    if (campos !== '') {
      campos = campos.slice(0, -2);
      let parts = campos.split(', ');
      if (parts.length > 1) {
        let lastElement = parts.pop();
        campos = parts.join(', ') + ' y ' + lastElement;
      }

      this.presentAlert(
        'Datos incompletos',
        'Favor de completar los siguientes campos:',
        campos + '.'
      );
      return false;
    } else {
      return true;
    }
  }

  async capturePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });
      this.adulto.foto = `data:image/jpeg;base64,${image.base64String}`;
    } catch (error) {
      console.error('Error capturando foto', error);
    }
  }

  changeValue(event: any, field: string) {
    const fields = field.split('.');
    fields.reduce((acc, part, index) => {
      if (index === fields.length - 1) {
        acc[part] = event.target.value;
      } else {
        if (!acc[part]) {
          acc[part] = {};
        }
      }
      return acc[part];
    }, this.adulto);
  }

  formatDateToDDMMYYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
