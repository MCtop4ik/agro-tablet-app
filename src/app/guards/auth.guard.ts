import { Injectable } from '@angular/core';
import { UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    private router: Router,
    private storageService: StorageService
  ) { }

  async isAuthenticated() {
    const result = await this.storageService.get('auth_token');
    let auth_value = result.value;
    return auth_value != null && auth_value != '';
}

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAuthenticated().then((result) => {
      console.log(result);
      if (!result) {
        return Promise.reject(this.router.navigate(['authentification']));
      };
      return Promise.resolve(true);
    });
  }

}
