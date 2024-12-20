import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountSettingsPageRoutingModule } from './account-settings-routing.module';

import { AccountSettingsPage } from './account-settings.page';
import { ProfileInfoComponent } from '../profile-info/profile-info.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountSettingsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AccountSettingsPage, ProfileInfoComponent, ChangePasswordComponent]
})
export class AccountSettingsPageModule {}
