import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SignupComponent } from './signup.component';
import { AuthenticatedService } from '../lbry-authenticated.service';

describe('SignupComponent', () => {
  let component: SignupComponent;

  describe('display', () => {
    let fixture: ComponentFixture<SignupComponent>;
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [ SignupComponent ],
        imports: [HttpClientTestingModule],
      })
      .compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(SignupComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('service interaction', () => {
    let signupTestFunc: Function
    let authenticatedService: AuthenticatedService;

    beforeEach(async () => {
      class MockAuthenticatedService {
        signup(username: string, password: string) {
          signupTestFunc(username, password)
        }
      }

      TestBed.configureTestingModule({
        providers: [
          [SignupComponent],
          { provide: AuthenticatedService, useClass: MockAuthenticatedService },
        ],
        imports: [HttpClientTestingModule],
      })

      component = TestBed.inject(SignupComponent);
      authenticatedService = TestBed.inject(AuthenticatedService);
    });

    it('clicking sign up button calls signup on the service', (done) => {
      signupTestFunc = (username : string, password : string) => {
        expect(username).toEqual('Mock User')
        expect(password).toEqual('Mock Password')
        done()
      }

      component.signup()
    });
  });
});
