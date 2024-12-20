import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DBService } from '../services/database.service';
import { SynchroniseService } from '../services/synchronise.service';
import { ModalController } from '@ionic/angular';
import { AccountSettingsPage } from '../account-settings/account-settings.page';
import { RigTicketsService } from '../services/production-transactions.service';
import { FieldsService } from '../services/fields.service';
import { DataService } from '../services/data.service';
import { TimeHoursService } from '../services/time-hours.service';
import { TimeMinutesService } from '../services/time-minutes.service';
import { FarmsService } from '../services/farms.service';
import { HayTypesService } from '../services/hay-types.service';
import { HayCutsService } from '../services/hay-cuts.service';
import { PopupCreateProductionTransactionComponent } from '../popup-create-production-transaction/popup-create-production-transaction.component';
import { PopupUpdateProductionTransactionComponent } from '../popup-update-production-transaction/popup-update-production-transaction.component';
import { PopupStatisticsComponent } from '../popup-statistics/popup-statistics.component';


@Component({
  selector: 'app-production-transactions.',
  templateUrl: './production-transactions.page.html',
  styleUrls: ['./production-transactions.page.scss'],
})
export class ProductionTransactionsPage implements OnInit {
  production_transactions: any[] = [];
  farms: any;
  fields: any;
  hay_types: any;
  hay_cuts: any;
  time_hours: any;
  time_minutes: any;
  visible_content: string[] = []

  constructor(
    private db: DBService, 
    private changeDetectorRef: ChangeDetectorRef,
    private synchroniseService: SynchroniseService,
    private modalController: ModalController,
    private production_transactions_service: RigTicketsService,
    private fieldsService: FieldsService,
    private farmsService: FarmsService,
    private hayTypesService: HayTypesService,
    private hayCutsService: HayCutsService,
    private dataService: DataService,
    private timeHoursService: TimeHoursService,
    private timeMinutesService: TimeMinutesService,
    ) { }

  ngOnInit() {
    this.load_data();
    this.get_data().then(() => {
      this.get_rig_tickets();
    })
  }

  async ionViewDidEnter() {
    await this.get_data();
    this.get_rig_tickets();
    this.changeDetectorRef.detectChanges();
  }

  async get_data() {
    this.farms = await this.dataService.loadData('farms');
    this.fields = await this.dataService.loadData('fields');
    this.hay_types = await this.dataService.loadData('hay_types');
    this.hay_cuts = await this.dataService.loadData('hay_cuts');
    this.time_minutes = await this.dataService.loadData('time_minutes');
    this.time_hours = await this.dataService.loadData('time_hours');
  }

  load_data() {
    this.fieldsService.load_fields();
    this.farmsService.load_farms();
    this.hayTypesService.load_hay_types();
    this.hayCutsService.load_hay_cuts();
    this.timeHoursService.load_time_hours();
    this.timeMinutesService.load_time_minutes();
  }

  get_farm_name(record_pk: string) {
    if (this.farms == undefined) {
      this.get_data().then(() => {
        return this.farmsService.get_farm_name(record_pk, this.farms);
      });
    }
    return this.farmsService.get_farm_name(record_pk, this.farms);
  }

  get_field_id(record_pk: string) {
    if (this.fields == undefined) {
      this.get_data().then(() => {
        return this.fieldsService.get_field_id(record_pk, this.fields)
      });
    }
    return this.fieldsService.get_field_id(record_pk, this.fields)
  }


  get_hay_type_description(category_kw: string) {
    if (this.hay_types == undefined) {
      this.get_data().then(() => {
        return this.hayTypesService.get_hay_type_description(category_kw, this.hay_types);
      });
    }
    return this.hayTypesService.get_hay_type_description(category_kw, this.hay_types);
  }

  get_hay_cut_description(category_kw: string) {
    if (this.hay_cuts == undefined) {
      this.get_data().then(() => {
        return this.hayCutsService.get_hay_cut_description(category_kw, this.hay_cuts);
      });
    }
    return this.hayCutsService.get_hay_cut_description(category_kw, this.hay_cuts);
  }

  get_time_hours(category_kw: string) {
    if (this.time_hours == undefined) {
      this.get_data().then(() => {
        return this.timeHoursService.get_time_hour_description(category_kw, this.time_hours);
      });
    }
    return this.timeHoursService.get_time_hour_description(category_kw, this.time_hours);
  }

  get_time_minutes(category_kw: string) {
    if (this.time_minutes == undefined) {
      this.get_data().then(() => {
        return this.timeMinutesService.get_time_minute_description(category_kw, this.time_minutes);
      });
    }
    return this.timeMinutesService.get_time_minute_description(category_kw, this.time_minutes);
  }

  get_rig_tickets() {
    this.db.getAll('production_transactions')?.then((data: any) => {
      const rigTickets = {...data[0]};
      delete rigTickets.id;
      this.production_transactions = Object.values(rigTickets);
    })
  }

  get_integer_field(item_float: string) {
    const number = parseFloat(item_float);
    return Number.isNaN(number) ? 'No' : number;
  }

  get_moisture(item_float: string) {
    const number = parseFloat(item_float);
    return Number.isNaN(number) ? 'No' : number.toString() + '%';
  }

  extract_date(date: string) {
    return this.dataService.extractDate(date);
  }

  async openAccountSettings() {
    const modal = await this.modalController.create({
      component: AccountSettingsPage
    });
    return await modal.present();
  }

  getDateFromString(date_str: string) {
    return new Date(Date.parse(date_str)).toLocaleDateString();
   }

  sortByActive() {
    // return this.rig_tickets.sort((a, b) => {
    //   if (a['Active_YN'] !== b['Active_YN']) {
    //     return b['Active_YN'] - a['Active_YN'];
    //   }
      
    //   return 0;
    // });
    return this.production_transactions;
  }


  synchronise(){
    this.synchroniseService.synchronise().then(() => {
      this.load_data();
      this.production_transactions = [];
      this.production_transactions_service.clearDatabase();
    }).catch(() => {
      console.log('reject')
    }).finally(() => {
      this.get_data().then(() => {});
    });
  }

  get_string_in_characters(convert_string: string, start: number, end: number) {
    return convert_string.slice(start, end)
  }

  async openCreateForm() {
    const create_rig_ticket_modal = await this.modalController.create({
      component: PopupCreateProductionTransactionComponent,
    });

    create_rig_ticket_modal.onDidDismiss().then((result) => {
      this.production_transactions_service.save_in_production_transactions(result.data).then(() => {
        this.get_rig_tickets();
        console.log(this.production_transactions);
        this.changeDetectorRef.detectChanges();
      });
    });

    return await create_rig_ticket_modal.present();
  }

  async openUpdateForm(rig_ticket: any) {
    const update_rig_ticket_modal = await this.modalController.create({
      component: PopupUpdateProductionTransactionComponent,
      componentProps: { data: rig_ticket }
    });

    update_rig_ticket_modal.onDidDismiss().then((result) => {
      this.production_transactions_service.save_in_production_transactions(result.data).then(() => {
        this.get_rig_tickets();
        this.changeDetectorRef.detectChanges();
      });
    });

    return await update_rig_ticket_modal.present();
  }


  async openStatisticsForm(rig_ticket: any) {
    const statistics_modal = await this.modalController.create({
      component: PopupStatisticsComponent,
      componentProps: { data: rig_ticket }
    });

    statistics_modal.onDidDismiss().then(() => {});

    return await statistics_modal.present();
  }
}
