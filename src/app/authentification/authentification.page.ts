import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.page.html',
  styleUrls: ['./authentification.page.scss'],
})
export class AuthentificationPage implements OnInit {
  loginForm!: FormGroup;
  error_label: boolean = false;

  constructor(
    private httpService: HttpService,
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
    this.save_token({ access_token: '32233', expires: 2000});
    this.router.navigate(['production-transactions']);
  }

  async login_btn() {
    console.log(this.loginForm.invalid, this.loginForm.value)
    if (this.loginForm.invalid) {
      this.error_label = true;
      this.changeDetectorRef.detectChanges();
      return;
    }
    let data: { email: string, password: string } = this.loginForm.value;
    try {
      this.httpService.authentification(data).subscribe((ans: any) => {
        console.log(ans);
        this.save_token(ans.body.token_info).then(() => {});
        this.save_user_info(ans.body.user_info).then(() => {});
        this.router.navigate(['production-transactions']);
      })
    } catch (error) {
      console.error('An error occurred:', error);
      this.error_label = true;
      this.changeDetectorRef.detectChanges();
    }
  }
  async save_token(token_info: { access_token: string, expires: number }) {
    await this.storageService.set('auth_token', token_info);
  }

  async save_user_info(user_info: { user_id: string, first_name: string, last_name: string, email: string }) {
    await this.storageService.set('logged_user', user_info);
  }

}
