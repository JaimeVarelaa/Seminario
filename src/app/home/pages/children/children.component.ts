import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SqliteService } from 'src/app/services/sqlite.service';
import { AddChildComponent } from './add-children/add-children.component';

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.scss'],
})
export class ChildrenComponent implements OnInit {
  children: any[] = [];

  constructor(
    private modalController: ModalController,
    private sqliteService: SqliteService
  ) {}

  ngOnInit() {
    setTimeout(async () => {
      this.children = await this.sqliteService.getChildren();
      console.log('Children:', this.children);
    }, 3000);
  }

  async presentAddChildModal() {
    const modal = await this.modalController.create({
      component: AddChildComponent,
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        // Si se agrega un niño, lo agregamos a la lista
        this.children.push(result.data);
      }
    });

    await modal.present();
  }

  async refreshChildren() {
    try {
      this.children = await this.sqliteService.getChildren();
    } catch (err) {
      console.error('Error al refrescar la lista de niños:', err);
    }
  }
  
}
