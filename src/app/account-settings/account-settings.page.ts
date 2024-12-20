import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.page.html',
  styleUrls: ['./account-settings.page.scss'],
})
export class AccountSettingsPage {

  constructor(
    private modalController: ModalController,
    private router: Router
    ) { }

  current_tab: string = 'profile-info';

  async dismiss() {
    this.router.navigate(['rig-tickets']);
    await this.modalController.dismiss();
  }

  change_tab(new_tab: string) {
    this.current_tab = new_tab;
  }
  
}
