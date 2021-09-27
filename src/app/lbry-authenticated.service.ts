import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Channel } from './video';
import { mockChannel } from './mock-channel';

// TODO guide https://blog.angular-university.io/angular-jwt-authentication/

export enum AuthenticatedError {
  NotFound,
  Unknown,
}
const API_NOT_FOUND = 'NOT_FOUND'

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedService {
  APIUrl: string = "https://example.com";

  constructor(private http: HttpClient) { }

  getMyChannel(): Observable<Channel | undefined> {
    return of(mockChannel);
  }

  login(username: string, password: string) : Observable<any> {
    // TODO - assuming for now that we're not putting the token in cookies. The interface shouldn't change much if we do.
    localStorage.setItem('logged-in-mock', 'true');
    return of(undefined)
    // TODO Make sure to do .shareReplay(); https://blog.angular-university.io/angular-jwt-authentication/
  }

  logout() : Observable<any> {
    localStorage.setItem('logged-in-mock', 'false');
    return of(undefined)
    // TODO Make sure to do .shareReplay(); https://blog.angular-university.io/angular-jwt-authentication/
  }

  isLoggedIn(): boolean {
    return localStorage.getItem("logged-in-mock") === 'true';
  }
}
