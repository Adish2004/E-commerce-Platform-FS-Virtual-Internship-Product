import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'https://8080-dcebadbaaeaaec334072909bccfaccecfone.premiumproject.examly.io/api/signup';

  constructor(private http: HttpClient) {}

  register(user: User): Observable<string> {
    return this.http.post(this.baseUrl + '/register', user, { responseType: 'text' });
  }

  login(email: string, password: string): Observable<string> {
    return this.http.post(this.baseUrl + '/login?email=' + email + '&password=' + password, {}, { responseType: 'text' });
  }
}
