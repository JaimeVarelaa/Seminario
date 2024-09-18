import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.scss'],
})
export class ChildrenComponent implements OnInit {
  private capturedPhoto: string | null = null;
  children: any[] = [];

  constructor(
    private alertController: AlertController,
    private sqliteService: SqliteService
  ) {}

  ngOnInit() {
    setTimeout(async () => {
      this.children = await this.sqliteService.getChild();
      console.log('Children:', this.children);
    }, 3000);
  }  

  async presentAddChildAlert() {
    const photo = await this.capturePhoto();
    if (!photo) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Agregar Niño',
      inputs: [
        { name: 'nombres', type: 'text', placeholder: 'Nombres' },
        { name: 'apepat', type: 'text', placeholder: 'Apellido Paterno' },
        { name: 'apemat', type: 'text', placeholder: 'Apellido Materno' },
        { name: 'edad', type: 'number', placeholder: 'Edad' },
        { name: 'fecha_nac', type: 'date', placeholder: 'Fecha de Nacimiento' },
        { name: 'deseo', type: 'text', placeholder: 'Deseo' },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Agregar',
          handler: async (data) => {
            data.foto = photo;
            await this.sqliteService.addChild(data);
          },
        },
      ],
    });

    await alert.present();
  }

  async capturePhoto(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      return `data:image/jpeg;base64,${image.base64String}`;
    } catch (error) {
      console.error('Error capturing photo', error);
      return null;
    }
  }
}
