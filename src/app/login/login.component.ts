import { Component, OnInit } from '@angular/core';

import { AuthenticatedService } from '../lbry-authenticated.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authenticatedService : AuthenticatedService) { }

  login(): void {
    this.authenticatedService.login('Mock User', 'Mock Password')
  }

  ngOnInit(): void {
  }

}
