import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private modalController: ModalController) { }

  async dismissModal() {
    await this.modalController.dismiss();
  }
}
