import { Component, OnInit } from '@angular/core';

import { AuthenticatedService } from '../lbry-authenticated.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private authenticatedService : AuthenticatedService) { }

  signup(): void {
    this.authenticatedService.signup('Mock User', 'Mock Password')
  }

  ngOnInit(): void {
  }

}
