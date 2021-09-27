import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HeaderComponent } from './header.component';
import { Channel } from '../video';
import { AuthenticatedService } from '../lbry-authenticated.service';
import { LoginService } from '../lbry-login.service';
import { Observable, of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;

  describe('display', () => {
    let fixture: ComponentFixture<HeaderComponent>;
    beforeEach(async () => {
      TestBed.configureTestingModule({
        declarations: [HeaderComponent],
        imports: [HttpClientTestingModule],
      })
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(HeaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it(`should render 'DASHsee' in the header`, () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.header-logo div')?.textContent).toContain('DASHsee');
    });

    it('shows login/signup buttons when logged out', () => {
      component.isLoggedIn = false

      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;

      expect(compiled.querySelector('#header-btn-log-in')).toBeTruthy();
      expect(compiled.querySelector('#header-btn-sign-up')).toBeTruthy();
      expect(compiled.querySelector('#header-btn-log-out')).toBeNull();
      expect(compiled.querySelector('#header-my-channel-thumbnail')).toBeNull();
      expect(compiled.querySelector('#header-my-channel-handle')).toBeNull();
    });

    it('shows avatar/username when logged in', () => {
      component.isLoggedIn = true;
      component.myChannel = {
        handle: "@DigitalCashNetwork",
        name: "Digital Cash Network",
        thumbnailUrl: "path/to/channel/thumbnail.png",
      };

      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;

      expect(compiled.querySelector('#header-btn-log-in')).toBeNull();
      expect(compiled.querySelector('#header-btn-sign-up')).toBeNull();
      expect(compiled.querySelector('#header-btn-log-out')).toBeTruthy();
      expect(compiled.querySelector('#header-my-channel-thumbnail')?.src).toContain("path/to/channel/thumbnail.png");
      expect(compiled.querySelector('#header-my-channel-handle')?.textContent).toContain("@DigitalCashNetwork");
    });
  });

  describe('service interaction', () => {
    let isLoggedInVal: boolean
    let getMyChannelObservable: Observable<Channel>
    let loginService: LoginService;
    let authenticatedService: AuthenticatedService;
    let logoutTestFunc: Function

    beforeEach(async () => {
      class MockLoginService {
        isLoggedIn(): boolean {
          return isLoggedInVal
        }
        logout(): void {
          logoutTestFunc()
        }
      }
      class MockAuthenticatedService {
        getMyChannel(): Observable<any> {
          return getMyChannelObservable
        }
      }

      TestBed.configureTestingModule({
        providers: [
          [HeaderComponent],
          { provide: LoginService, useClass: MockLoginService },
          { provide: AuthenticatedService, useClass: MockAuthenticatedService },
        ],
        imports: [HttpClientTestingModule],
      })

      component = TestBed.inject(HeaderComponent);
      loginService = TestBed.inject(LoginService);
      authenticatedService = TestBed.inject(AuthenticatedService);
    });

    it('isLoggedIn set to false when service says so', () => {
      isLoggedInVal = false
      getMyChannelObservable = new Observable() // shouldn't even be called

      component.setLoginState()

      expect(component.isLoggedIn).toBeFalse();
      expect(component.myChannel).toBeUndefined();

    });

    it('isLoggedIn set to true when service says so, and myChannel set from service', (done) => {
      isLoggedInVal = true;
      getMyChannelObservable = new Observable(subscriber => {
        // give the subscriber the video it wants
        subscriber.next({
          handle: "@DigitalCashNetwork",
          name: "Digital Cash Network",
          thumbnailUrl: "path/to/channel/thumbnail.png",
        })

        // now observe the results

        expect(component.isLoggedIn).toBeTrue();
        expect(component.myChannel).toEqual({
          handle: "@DigitalCashNetwork",
          name: "Digital Cash Network",
          thumbnailUrl: "path/to/channel/thumbnail.png",
        });

        done();
      })

      component.setLoginState();
    });

    it('isLoggedIn set to true when service says so, and myChannel set to undefined from service', (done) => {
      isLoggedInVal = true;
      getMyChannelObservable = new Observable(subscriber => {
        // give the subscriber the video it wants
        subscriber.next(undefined)

        // now observe the results

        expect(component.isLoggedIn).toBeTrue();
        expect(component.myChannel).toBeUndefined();

        done();
      })

      component.setLoginState();
    });

    it('clicking log in button calls login on the service', (done) => {
      logoutTestFunc = done

      component.logout()
    });
  });
});
