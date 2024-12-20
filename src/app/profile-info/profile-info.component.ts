import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/http.service';
import { StorageService } from '../services/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss'],
})
export class ProfileInfoComponent implements OnInit {
  profileForm!: FormGroup;

  constructor(    
    private httpService: HttpService,
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalService: ModalService,
    private authenticationService: AuthService
    ) { }

  async ngOnInit() {
    this.profileForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  
    const profile_info = await this.get_profile_info();
    
  
    this.profileForm.patchValue({
      first_name: profile_info.first_name,
      last_name: profile_info.last_name,
      email: profile_info.email
    });
  }

  async get_profile_info(){
    const insert_data = await this.getUserInfoFromStorage();
    return JSON.parse(insert_data["value"]);
  }


  async edit_profile_info() {
    const profile_user_id = (await this.get_profile_info())['user_id'];
    const user_info = { ...this.profileForm.value, user_id: profile_user_id };
    await this.save_user_info(user_info);
    const insert_data = await this.get_profile_info();
    if (insert_data !== "error") {
      this.httpService.editProfileInfo({'profile_info': insert_data, 'user_info': user_info}).subscribe(() => {});
    }
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

  get formControls() {
    return this.profileForm.controls;
  }

  async logout() {
    await this.storageService.clear();
    this.router.navigate(['authentification']);
    this.modalService.dismissModal();
  }

  async save_user_info(user_info: {user_id: string, first_name: string, last_name: string, email: string}) {
    await this.storageService.set('logged_user', user_info);
  }

}
