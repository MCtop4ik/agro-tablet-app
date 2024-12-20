import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { ModalController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-popup-create-production-transaction',
  templateUrl: './popup-create-production-transaction.component.html',
  styleUrls: ['./popup-create-production-transaction.component.scss'],
})
export class PopupCreateProductionTransactionComponent implements OnInit {

  form: FormGroup;

  farms: any;
  fields: any;
  hay_types: any;
  hay_cuts: any;
  time_minutes: any;
  time_hours: any;
  user_id: any;

  filteredFields: any = [];

  constructor(private fb: FormBuilder,
              private modalController: ModalController,
              private dataService: DataService,
              private changeDetectorRef: ChangeDetectorRef,
              private authService: AuthService
  ) {

    this.form = this.fb.group({
      Farm: new FormControl(''),
      Field: new FormControl(''),
      Individual: new FormControl(''),
      Date: new FormControl((new Date()).toISOString().substring(0, 19)),
      Hay_Type: new FormControl(''),
      Hay_Cut: new FormControl(''),
      Start_Time_Hours: new FormControl(''),
      Start_Time_Minutes: new FormControl(''),
      End_Time_Hours: new FormControl(''),
      End_Time_Minutes: new FormControl(''),
      Total_Hours: new FormControl(''),
      Tons_Baled: new FormControl(''),
      Bales_Baled: new FormControl(''),
      Moisture: new FormControl(''),
      Acres: new FormControl(''),
      Tons_Acre: new FormControl(''),
      Bales_Acre: new FormControl(''),
      Tons_Hour: new FormControl(''),
      Bales_Hour: new FormControl('')
    });
  }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    this.dataService.loadData('farms').then((farms: any) => {
      this.farms = farms;
      this.onSelectedFarmChange(this.form.value['Farm'])
    });
    this.fields = await this.dataService.loadData('fields');
    this.hay_types = await this.dataService.loadData('hay_types');
    this.hay_cuts = await this.dataService.loadData('hay_cuts');
    this.time_minutes = await this.dataService.loadData('time_minutes');
    this.time_hours = await this.dataService.loadData('time_hours');
    this.user_id = await this.authService.get_user_id();
    this.changeDetectorRef.detectChanges();
  }

  async onSubmit() {
    if (this.form.valid) {
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
      this.form.controls['Individual'].setValue(this.user_id);
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

  onSelectedFarmChange(farm: any) {
    this.filteredFields = this.fields.filter((field: any) => field.Parent_Farm === farm);
  }


  onSelectedFieldChange(event: any) {
    const selectedField = event.detail.value;
    const field = this.fields.filter((field: any) => field.Record_PK === selectedField)[0];
    console.log(field);
    this.form.controls['Acres'].setValue(field["Field_Acres"].toString());
  }
}
