import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AdultoService } from 'src/app/services/adulto.service.service';
import { NiñoService } from 'src/app/services/niño-service.service';
import { Adulto, Niño } from 'src/models/adulto.model';
@Component({
  selector: 'app-add-children',
  templateUrl: './add-children.component.html',
  styleUrls: ['./add-children.component.scss'],
})
export class AddChildComponent {
  @Input() nino: Niño;
  @Input() nuevo: boolean;

  currentStep = 1;
  steps = ['Foto', 'Padre', 'Datos'];

  adultos: Adulto[] = [];

  adultoSeleccionado: Adulto = null;

  popoverOptions = {
    cssClass: 'custom-popover',
  };

  onSelectAdult(event: any) {
    this.adultoSeleccionado = event.detail.value;
    this.nino.idPadre = this.adultoSeleccionado.id;
  }

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private adultoService: AdultoService,
    private niñoService: NiñoService,
  ) { }

  closeModal() {
    this.modalController.dismiss();
  }
  async acceptModal() {
    let result: boolean = false;
    this.nino.fecha_nac = this.formatDateToDDMMYYYY(
      new Date(this.nino.fecha_nac)
    );
    if (this.nuevo) {
      result = await this.niñoService.addNiño(this.nino);
    } else {
      result = await this.niñoService.updateNiño(this.nino);
    }
    if (result) {
      this.modalController.dismiss(this.nino);
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

  async goNext() {
    if (this.currentStep < this.steps.length && this.checkStep()) {
      this.currentStep++;
      if (this.currentStep === 2) {
        this.adultos = await this.adultoService.getAdultos();
      }
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
        if (!this.nino.foto) {
          campos += 'Foto, ';
        }
        break;

      case 2:
        if (!this.nino.idPadre) {
          campos += 'Padre, ';
        }
        break;

      case 3:
        if (this.nino.nombres === '') {
          campos += 'Nombres, ';
        }
        if (this.nino.apellido_paterno === '') {
          campos += 'Apellido Paterno, ';
        }
        if (this.nino.apellido_materno === '') {
          campos += 'Apellido Materno, ';
        }
        if (this.nino.edad === 0) {
          campos += 'Edad, ';
        }
        if (this.nino.deseo === '') {
          campos += 'Deseo, ';
        }
        break;
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
      this.nino.foto = `data:image/jpeg;base64,${image.base64String}`;
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
    }, this.nino);
  }

  formatDateToDDMMYYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
