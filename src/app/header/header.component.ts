import { Component, OnInit } from '@angular/core';

import { Channel } from '../video';

import { AuthenticatedService } from '../lbry-authenticated.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // NOTE: channel can be null even if logged in. The user might not have a channel.
  myChannel? : Channel;
  isLoggedIn : boolean = false;

  constructor(private authenticatedService : AuthenticatedService) { }

  setLoginState(): void {
    this.isLoggedIn = this.authenticatedService.isLoggedIn()
    if (this.isLoggedIn) {
      this.authenticatedService.getMyChannel()
        .subscribe(channel => {
          this.myChannel = channel
        })
    }
  }

  logout(): void {
    this.authenticatedService.logout()
  }

  ngOnInit(): void {
    this.setLoginState()
  }
}
