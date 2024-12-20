import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { ModalController, NavParams } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-popup-statistics',
  templateUrl: './popup-statistics.component.html',
  styleUrls: ['./popup-statistics.component.scss'],
})
export class PopupStatisticsComponent implements OnInit {
  data: any;

  constructor(private navParams: NavParams,
    private modalController: ModalController,
  ) {
  }
  ngOnInit() {
    this.data = this.navParams.get('data');
  }

  get_integer_field(item_float: string) {
    const number = parseFloat(item_float);
    return Number.isNaN(number) ? 'No' : number;
  }

  async onCancel() {
    await this.modalController.dismiss();
  }

}
