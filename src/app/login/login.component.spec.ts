import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LoginComponent } from './login.component';
import { AuthenticatedService } from '../lbry-authenticated.service';

import { Observable, of } from 'rxjs';

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
    });

    it('should create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('Error message should show up', () => {
      component.errorMessage = "Test 123"
      fixture.detectChanges();
      expect(component).toBeTruthy();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.error-message')?.textContent).toContain("Test 123")
    });

    it('Non-Error message should not show up', () => {
      component.errorMessage = undefined
      fixture.detectChanges();
      expect(component).toBeTruthy();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.error-message')).toBeNull()
    });

  });

  describe('service interaction', () => {
    let authenticatedService: AuthenticatedService;

    beforeEach(async () => {
      class MockAuthenticatedService {
        login(username: string, password: string) {
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

    it('clicking log in button calls login on successfully the service', () => {
      spyOn(authenticatedService, 'login').and.returnValue(of(undefined))

      component.login(true)

      expect(authenticatedService.login).toHaveBeenCalledWith('Mock User', 'Mock Password')

      // cross fingers, I suppose, that the Observable / subscribe stuff happens fast enough for this one
      expect(component.errorMessage).toBeUndefined()
    });

    it('clicking log in fail button calls login on the service unsuccessfully', () => {
      // tell it to return an error
      spyOn(authenticatedService, 'login').and.returnValue(new Observable(subscriber => subscriber.error({})))

      // tell it to send the Wrong Password
      component.login(false)

      expect(authenticatedService.login).toHaveBeenCalledWith('Mock User', 'Wrong Password')

      // cross fingers, I suppose, that the Observable / subscribe stuff happens fast enough for this one
      expect(component.errorMessage).toEqual("Login Error")
    });

  });
});
