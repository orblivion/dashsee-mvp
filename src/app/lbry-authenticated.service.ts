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
  private myChannel = new Subject<Channel | undefined>();

  constructor(private http: HttpClient) { }

  // components subscribe to this to get my channel
  getMyChannelChanges(): Observable<Channel | undefined> {
    return this.myChannel.asObservable();
  }

  updateMyChannel(loggedIn : boolean) {
    if (loggedIn) {
      this.myChannel.next(mockChannel);
    } else {
      this.myChannel.next(undefined);
    }
  }

  login(username: string, password: string) : Observable<any> {
    // TODO - assuming for now that we're not putting the token in cookies. The interface shouldn't change much if we do.
    localStorage.setItem('logged-in-mock', 'true');
    this.updateMyChannel(true)
    return of(undefined)
    // TODO Make sure to do .shareReplay(); https://blog.angular-university.io/angular-jwt-authentication/
  }

  signup(username: string, password: string) : Observable<any> {
    // for now just log in
    return this.login(username, password)
  }

  logout() : Observable<any> {
    localStorage.setItem('logged-in-mock', 'false');
    this.updateMyChannel(false)
    return of(undefined)
    // TODO Make sure to do .shareReplay(); https://blog.angular-university.io/angular-jwt-authentication/
  }

  isLoggedIn(): boolean {
    return localStorage.getItem("logged-in-mock") === 'true';
  }
}
