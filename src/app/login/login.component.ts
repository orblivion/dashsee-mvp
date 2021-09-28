import { Component, OnInit } from '@angular/core';

import { AuthenticatedService } from '../lbry-authenticated.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage? : string;

  constructor(private authenticatedService : AuthenticatedService) { }

  login(success : boolean): void {
    this.errorMessage = undefined;
    this.authenticatedService.login('Mock User', success ? 'Mock Password' : 'Wrong Password')
      .subscribe({
        error: () => {
          this.errorMessage = "Login Error";
        },
      });
  }

  ngOnInit(): void {
  }

}
