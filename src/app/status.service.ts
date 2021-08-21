import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  statuses: string[] = [];

  add(status: string) {
    this.statuses.push(status);
  }

  clear() {
    this.statuses = [];
  }

  constructor() { }
}
