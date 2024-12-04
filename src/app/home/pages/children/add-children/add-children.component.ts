import { Component, EventEmitter, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { SqliteService } from 'src/app/services/sqlite.service';
//import { Geolocation } from '@capacitor/geolocation';
//import * as L from 'leaflet';

@Component({
  selector: 'app-add-children',
  templateUrl: './add-children.component.html',
  styleUrls: ['./add-children.component.scss'],
})
export class AddChildComponent {
  childData = {
    nombres: '',
    apepat: '',
    apemat: '',
    edad: null,
    fecha_nac: '',
    deseo: '',
    foto: '',
    direccion: '',
    telefono: '',
    vivienda: '',
    techo: '',
    piso: '',
    habitaciones: '',
    combustible: '',
    personas: '',
    enfermedad_cronica: '',
    personas_trabajan: null,
  };

  @Output() childAdded = new EventEmitter<any>();

  //map: L.Map;
  //marker: L.Marker;

  constructor(
    private modalController: ModalController,
    private sqliteService: SqliteService
  ) {}

  dismiss() {
    this.modalController.dismiss();
  }

  async ngOnInit() {
    //this.initMap();
  }

  /*initMap() {
    this.map = L.map('map').setView([21.8794, -102.3004], 15);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  
    const icon = L.icon({
      iconUrl: 'assets/images/marker-icon.png',
      iconRetinaUrl: 'assets/images/marker-icon-2x.png',
      shadowUrl: 'assets/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  
    this.marker = L.marker([21.8794, -102.3004], { icon }).addTo(this.map);
  }
  

  async getLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      // Actualizar las coordenadas en el modelo
      this.childData.ubicacion = { lat: latitude, lng: longitude };

      // Mover el marcador al lugar de la ubicación obtenida
      this.marker.setLatLng([latitude, longitude]);
      this.map.setView([latitude, longitude], 15); // Centrar el mapa en la nueva ubicación

      console.log('Ubicación obtenida:', latitude, longitude);
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);
    }
  }*/

  async capturePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });
      this.childData.foto = `data:image/jpeg;base64,${image.base64String}`;
    } catch (error) {
      console.error('Error capturando foto', error);
    }
  }

  async addChild() {
    try {
      console.log(this.childData);
      await this.sqliteService.addChild(this.childData);
      this.childAdded.emit(this.childData);
      this.dismiss();
    } catch (error) {
      console.error('Error al agregar el niño:', error);
    }
  }

  changeValue(event: any, field: string) {
    this.childData[field] = event.target.value;
  }
}
