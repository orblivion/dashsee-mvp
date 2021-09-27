import { Component, OnInit } from '@angular/core';

import { Channel } from '../video';

import { AuthenticatedService } from '../lbry-authenticated.service';
import { LoginService } from '../lbry-login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  myChannel? : Channel;
  isLoggedIn : boolean = false;

  constructor(private loginService : LoginService, private authenticatedService : AuthenticatedService) { }

  setLoginState(): void {
    this.isLoggedIn = this.loginService.isLoggedIn()
    if (this.isLoggedIn) {
      this.authenticatedService.getMyChannel()
        .subscribe(channel => {
          this.myChannel = channel
        })
    }
  }

  logout(): void {
    this.loginService.logout()
  }

  ngOnInit(): void {
    this.setLoginState()
  }
}
