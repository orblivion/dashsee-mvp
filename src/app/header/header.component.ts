import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Channel } from '../video';

import { AuthenticatedService } from '../lbry-authenticated.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // NOTE: channel can be null even if logged in. The user might not have a channel.
  private channelSubscription : Subscription;
  myChannel? : Channel;
  isLoggedIn : boolean = false;

  constructor(private authenticatedService : AuthenticatedService) {
    this.channelSubscription = this.authenticatedService.getMyChannelChanges()
      .subscribe(channel => {
        this.isLoggedIn = this.authenticatedService.isLoggedIn()
        this.myChannel = channel
      })
  }

  logout(): void {
    this.authenticatedService.logout()
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    // To avoid memory leaks, apparently
    this.channelSubscription.unsubscribe();
  }
}
