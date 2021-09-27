import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LoginComponent } from './login.component';
import { AuthenticatedService } from '../lbry-authenticated.service';

describe('LoginComponent', () => {
  let component: LoginComponent;

  describe('display', () => {
    let fixture: ComponentFixture<LoginComponent>;
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ LoginComponent ],
        imports: [HttpClientTestingModule],
      })
      .compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('service interaction', () => {
    let loginTestFunc: Function
    let authenticatedService: AuthenticatedService;

    beforeEach(async () => {
      class MockAuthenticatedService {
        login(username: string, password: string) {
          loginTestFunc(username, password)
        }
      }

      TestBed.configureTestingModule({
        providers: [
          [LoginComponent],
          { provide: AuthenticatedService, useClass: MockAuthenticatedService },
        ],
        imports: [HttpClientTestingModule],
      })

      component = TestBed.inject(LoginComponent);
      authenticatedService = TestBed.inject(AuthenticatedService);
    });

    it('clicking log in button calls login on the service', (done) => {
      loginTestFunc = (username : string, password : string) => {
        expect(username).toEqual('Mock User')
        expect(password).toEqual('Mock Password')
        done()
      }

      component.login()
    });
  });
});
