import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { EnvService } from './env.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  token: any;

  constructor(
      private http: HttpClient,
      private storage: NativeStorage,
      private env: EnvService,
  ) { }

  login(email: String, password: String) {
    return this.http.post(this.env.API_URL + 'auth/login',
        {email: email, password: password}
        ).pipe(
            tap(token => {
              this.storage.setItem('token', token)
                  .then(
                      () => {
                        console.log('Token Stored');
                      },
                      error => console.error('Error storing item', error)
                  );
              this.token = token;
              this.isLoggedIn = true;
              return token;
            }),
    );
  }

  register(fName: String, lName: String, email: String, password: String) {
    return this.http.post(this.env.API_URL + 'auth/register',
        {fName: fName, lName:  lName, email: email, password: password});
  }

  logout() {
    const headers = new HttpHeaders({
        'Authorization': this.token['token_type'] + ' ' + this.token['access_token']
    });
  }
}
