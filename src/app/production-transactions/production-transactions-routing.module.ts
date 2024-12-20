import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductionTransactionsPage } from './production-transactions.page';

const routes: Routes = [
  {
    path: '',
    component: ProductionTransactionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionTransactionsPageRoutingModule {}
