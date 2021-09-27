import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from "@angular/common/http";

// TODO guide https://blog.angular-university.io/angular-jwt-authentication/

export enum LbryLoginError {
  NotFound,
  Unknown,
}
const API_NOT_FOUND = 'NOT_FOUND'

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  APIUrl: string = "https://example.com";

  constructor(private http: HttpClient) { }

  // TODO - assuming for now that we're not putting the token in cookies. The interface shouldn't change much if we do.

  login(username: string, password: string) {
    localStorage.setItem('logged-in-mock', 'true');
    return of();
    // TODO Make sure to do .shareReplay(); https://blog.angular-university.io/angular-jwt-authentication/
  }

  isLoggedIn(): boolean {
    return localStorage.getItem("logged-in-mock") === 'false';
  }
}
