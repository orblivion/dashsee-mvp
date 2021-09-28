import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SignupComponent } from './signup.component';
import { AuthenticatedService } from '../lbry-authenticated.service';

import { Observable, of } from 'rxjs';

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
        signup(username: string, password: string) {
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

    it('clicking log in button calls signup on successfully the service', () => {
      spyOn(authenticatedService, 'signup').and.returnValue(of(undefined))

      component.signup(true)

      expect(authenticatedService.signup).toHaveBeenCalledWith('Mock User', 'Mock Password')

      // cross fingers, I suppose, that the Observable / subscribe stuff happens fast enough for this one
      expect(component.errorMessage).toBeUndefined()
    });

    it('clicking log in fail button calls signup on the service unsuccessfully', () => {
      // tell it to return an error
      spyOn(authenticatedService, 'signup').and.returnValue(new Observable(subscriber => subscriber.error({})))

      // tell it to send the Wrong Password
      component.signup(false)

      expect(authenticatedService.signup).toHaveBeenCalledWith('Mock User', 'Wrong Password')

      // cross fingers, I suppose, that the Observable / subscribe stuff happens fast enough for this one
      expect(component.errorMessage).toEqual("Signup Error")
    });


  });
});
