import { Component, OnInit } from '@angular/core';

import { AuthenticatedService } from '../lbry-authenticated.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  errorMessage? : string;

  constructor(private authenticatedService : AuthenticatedService) { }

  signup(success : boolean): void {
    this.errorMessage = undefined;
    this.authenticatedService.signup('Mock User', success ? 'Mock Password' : 'Wrong Password')
      .subscribe({
        error: () => {
          this.errorMessage = "Signup Error";
        },
      });
  }

  ngOnInit(): void {
  }

}
