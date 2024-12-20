import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { ModalController, NavParams } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-popup-update-production-transaction',
  templateUrl: './popup-update-production-transaction.component.html',
  styleUrls: ['./popup-update-production-transaction.component.scss'],
})
export class PopupUpdateProductionTransactionComponent implements OnInit {

  form: FormGroup;

  farms: any;
  fields: any;
  hay_types: any;
  hay_cuts: any;
  time_minutes: any;
  time_hours: any;
  user_id: any;

  filteredFields: any = [];

  data: any;

  constructor(private fb: FormBuilder,
              private modalController: ModalController,
              private dataService: DataService,
              private changeDetectorRef: ChangeDetectorRef,
              private navParams: NavParams,
              private authService: AuthService
  ) {
    this.data = this.navParams.get('data');
    this.form = this.fb.group({
      Record_PK: new FormControl(this.data['Record_PK']),
      Farm: new FormControl(this.data["Farm"]),
      Field: new FormControl(this.data["Field"]),
      Individual: new FormControl(this.data["Individual"]),
      Date: new FormControl(this.data["Date"]),
      Hay_Type: new FormControl(this.data["Hay_Type"]),
      Hay_Cut: new FormControl(this.data["Hay_Cut"]),
      Start_Time_Hours: new FormControl(this.data["Start_Time_Hours"]),
      Start_Time_Minutes: new FormControl(this.data["Start_Time_Minutes"]),
      End_Time_Hours: new FormControl(this.data["End_Time_Hours"]),
      End_Time_Minutes: new FormControl(this.data["End_Time_Minutes"]),
      Total_Hours: new FormControl(this.data["Total_Hours"]),
      Tons_Baled: new FormControl(this.data["Tons_Baled"]),
      Bales_Baled: new FormControl(this.data["Bales_Baled"]),
      Moisture: new FormControl(this.data["Moisture"]),
      Acres: new FormControl(this.data["Acres"]),
      Tons_Acre: new FormControl(this.data["Tons_Acre"]),
      Bales_Acre: new FormControl(this.data["Bales_Acre"]),
      Tons_Hour: new FormControl(this.data["Tons_Hour"]),
      Bales_Hour: new FormControl(this.data["Bales_Hour"])
    });
  }

  ngOnInit() {}

  async ionViewDidEnter() {
    console.log('hete')
    this.farms = await this.dataService.loadData('farms');
    this.dataService.loadData('fields').then((fields: any) => {
      this.fields = fields;
      this.onSelectedFarmChange(this.form.value['Farm']);
    });
    this.hay_types = await this.dataService.loadData('hay_types');
    this.hay_cuts = await this.dataService.loadData('hay_cuts');
    this.time_minutes = await this.dataService.loadData('time_minutes');
    this.time_hours = await this.dataService.loadData('time_hours');
    this.user_id = await this.authService.get_user_id();
    this.changeDetectorRef.detectChanges();
  }

  async onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
      const start_time_hours = parseInt(this.form.value['Start_Time_Hours'].slice(-2));
      const start_time_minutes = parseInt(this.form.value['Start_Time_Minutes'].slice(-2));
      const end_time_hours = parseInt(this.form.value['End_Time_Hours'].slice(-2));
      const end_time_minutes = parseInt(this.form.value['End_Time_Minutes'].slice(-2));
      const acres = parseInt(this.form.value["Acres"])
      const tons = parseInt(this.form.value["Tons_Baled"]);
      const bales = parseInt(this.form.value["Bales_Baled"]);

      const total_hours = (end_time_hours + end_time_minutes / 100) - (start_time_hours + start_time_minutes / 100)
      const tons_per_acre = Math.round((tons / acres) * 100) / 100;
      const bales_per_acre = Math.round((bales/ acres) * 100) / 100;
      const tons_per_hour = Math.round((tons / total_hours) * 100) / 100;
      const bales_per_hour = Math.round((bales / total_hours) * 100) / 100;

      this.form.controls['Total_Hours'].setValue(total_hours.toString());
      this.form.controls['Tons_Acre'].setValue(tons_per_acre.toString());
      this.form.controls['Bales_Acre'].setValue(bales_per_acre.toString());
      this.form.controls['Tons_Hour'].setValue(tons_per_hour.toString());
      this.form.controls['Bales_Hour'].setValue(bales_per_hour.toString());
      await this.modalController.dismiss(this.form.value);
    }
  }

  async onCancel() {
    await this.modalController.dismiss();
  }

  onFarmChange(event: any) {
    const selectedFarm = event.detail.value;
    this.filteredFields = this.fields.filter((field: any) => field.Parent_Farm === selectedFarm);
    this.form.get('Field')?.reset();
  }

  onSelectedFieldChange(event: any) {
    const selectedField = event.detail.value;
    const field = this.fields.filter((field: any) => field.Record_PK === selectedField)[0];
    this.form.controls['Acres'].setValue(field["Field_Acres"].toString());
  }

  onSelectedFarmChange(farm: any) {
    this.filteredFields = this.fields.filter((field: any) => field.Parent_Farm === farm);
  }
  
}