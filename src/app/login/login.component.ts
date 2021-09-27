import { Component, OnInit } from '@angular/core';

import { LoginService } from '../lbry-login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService : LoginService) { }

  login(): void {
    this.loginService.login('Mock User', 'Mock Password')
  }

  ngOnInit(): void {
  }

}
