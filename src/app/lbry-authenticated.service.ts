import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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

  getMyChannel(): Observable<Channel> {
    return of(mockChannel);
  }
}
