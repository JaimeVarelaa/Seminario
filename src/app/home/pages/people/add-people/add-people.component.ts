import { Component, Input } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ModalController } from '@ionic/angular';
import { Adulto } from 'src/models/adulto.model';

@Component({
  selector: 'app-add-people',
  templateUrl: './add-people.component.html',
  styleUrls: ['./add-people.component.scss'],
})
export class AddPeopleComponent {
  @Input() adulto: Adulto;

  currentStep = 1;
  steps = ['Foto', 'Datos', 'Dirección', 'Estudio'];

  constructor(private modalController: ModalController) { }

  closeModal() {
    this.modalController.dismiss();
  }

  acceptModal() {
    // const result = { accepted: true, id: this.idAdulto };
    //this.modalController.dismiss(result);
    console.log(this.adulto)
    console.log(this.formatDateToDDMMYYYY(new Date(this.adulto.fecha_nac)))
  }

  goBack() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goNext() {
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
    } else {
      this.acceptModal();
    }
  }

  goToStep(step: number) {
    this.currentStep = step;
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
    this.adulto[field] = event.target.value;
  }

  formatDateToDDMMYYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
