import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

    constructor(
        public storageService: StorageService
    ){}

    async get_token(){
        const result = await this.storageService.get('auth_token');
        console.log(result, result.value);
        let auth_value = JSON.parse(result.value);
        return auth_value.token;
    }

    async get_user_id(){
        const result = await this.storageService.get('logged_user');
        console.log(result.value);
        let user_info = JSON.parse(result.value);
        return user_info.user_id;
    }
}