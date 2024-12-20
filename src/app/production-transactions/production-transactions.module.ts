import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductionTransactionsPageRoutingModule } from './production-transactions-routing.module';

import { ProductionTransactionsPage } from './production-transactions.page';
import { PopupCreateProductionTransactionComponent } from '../popup-create-production-transaction/popup-create-production-transaction.component';
import { PopupUpdateProductionTransactionComponent } from '../popup-update-production-transaction/popup-update-production-transaction.component';
import { PopupStatisticsComponent } from '../popup-statistics/popup-statistics.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ProductionTransactionsPageRoutingModule
    ],
  declarations: [ProductionTransactionsPage, PopupCreateProductionTransactionComponent, PopupUpdateProductionTransactionComponent, PopupStatisticsComponent]
})
export class RigTicketsPageModule {}
