import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HeaderComponent } from './header.component';
import { Channel } from '../video';
import { AuthenticatedService } from '../lbry-authenticated.service';
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
    let getMyChannelChangesObservable: Observable<Channel | undefined>
    let authenticatedService: AuthenticatedService;

    beforeEach(async () => {
      class MockAuthenticatedService {
        getMyChannelChanges(): Observable<any> {
          return getMyChannelChangesObservable
        }
        isLoggedIn(): boolean {
          return isLoggedInVal
        }
        logout(): void {}
      }

      TestBed.configureTestingModule({
        providers: [
          [HeaderComponent],
          { provide: AuthenticatedService, useClass: MockAuthenticatedService },
        ],
        imports: [HttpClientTestingModule],
      })

      authenticatedService = TestBed.inject(AuthenticatedService);
    });

    // Because of the Subject stuff, the component and Observable responses
    // need to be initialized with beforeEach. Different test cases have
    // different needs so we have a different beforeEach for each test.

    describe('when service says I am logged out', () => {
      beforeEach(async () => {
        isLoggedInVal = false
        getMyChannelChangesObservable = of(undefined)

        component = TestBed.inject(HeaderComponent);
      });
      it('isLoggedIn set to false and myChannel set to undefined ', () => {
        expect(component.isLoggedIn).toBeFalse();
        expect(component.myChannel).toBeUndefined();
      });
    });

    describe('when service says I am logged in and I have a channel', () => {
      beforeEach(async () => {
        isLoggedInVal = true;
        getMyChannelChangesObservable = of({
          handle: "@DigitalCashNetwork",
          name: "Digital Cash Network",
          thumbnailUrl: "path/to/channel/thumbnail.png",
        });
        component = TestBed.inject(HeaderComponent);
      });
      it('isLoggedIn set to true, myChannel is set to my channel', () => {
        expect(component.isLoggedIn).toBeTrue();
        expect(component.myChannel).toEqual({
          handle: "@DigitalCashNetwork",
          name: "Digital Cash Network",
          thumbnailUrl: "path/to/channel/thumbnail.png",
        });
      })
    });

    describe('when service says I am logged in but I do not have a channel', () => {
      beforeEach(async () => {
        isLoggedInVal = true;
        getMyChannelChangesObservable = of(undefined)
        component = TestBed.inject(HeaderComponent);
      });
      it('isLoggedIn set to true and myChannel set to undefined', () => {
        expect(component.isLoggedIn).toBeTrue();
        expect(component.myChannel).toBeUndefined();
      });
    });

    describe('clicking log out button', () => {
      beforeEach(async () => {
        getMyChannelChangesObservable = of(undefined)
        component = TestBed.inject(HeaderComponent);
      });
      it('calls logout on the service', () => {
        spyOn(authenticatedService, 'logout')

        component.logout()

        expect(authenticatedService.logout).toHaveBeenCalled()
      });
    });
  });
});
