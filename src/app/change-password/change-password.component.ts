import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { StorageService } from '../services/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  passwordForm!: FormGroup;

  constructor(    
    private httpService: HttpService,
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private authenticationService: AuthService
    ) { }

  async ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      new_password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    });
  
  }
  async getUserInfoFromStorage() {
    try {
      const key = 'logged_user';
      const data = await this.storageService.get(key);
      return data;
    } catch (error) {
      console.error('Error getting user info from storage:', error);
      return 'error';
    }
  }

  async get_profile_info(){
    const insert_data = await this.getUserInfoFromStorage();
    console.log(insert_data["value"]);
    return JSON.parse(insert_data["value"]);
  }


  async changePassword() {
    const profile_user_id = (await this.get_profile_info())['user_id'];
    if (this.passwordForm.value.new_password == this.passwordForm.value.confirm_password) {
      this.httpService.changePassword({'new_password': this.passwordForm.value.new_password, 'user_id': profile_user_id}).subscribe(() => {});
    }
  }


  get formControls() {
    return this.passwordForm.controls;
  }

}

