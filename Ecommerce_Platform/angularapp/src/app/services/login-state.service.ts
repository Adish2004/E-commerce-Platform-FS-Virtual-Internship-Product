import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginStateService {
  private loginStatus = new Subject<boolean>();
  loginStatus$ = this.loginStatus.asObservable();

  setLoginStatus(status: boolean) {
    this.loginStatus.next(status);
  }
}
