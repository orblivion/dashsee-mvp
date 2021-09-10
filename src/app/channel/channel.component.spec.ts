import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ChannelComponent } from './channel.component';
import { LbryService, LbryServiceError } from '../lbry.service';
import { Channel } from '../models';

import { Observable } from 'rxjs';

const exampleChannel = {
  handle: "@DigitalCashNetwork",
  name: "Digital Cash Network",
  description: "channel description",
  thumbnailUrl: "path/to/channel/thumbnail.png",
  canonicalUri: "@DigitalCashNetwork:c",
}

describe('ChannelComponent', () => {
  let component: ChannelComponent;
  let lbryService: LbryService;
  let fixture: ComponentFixture<ChannelComponent>;

  describe('display', () => {
    beforeEach(async () => {
      TestBed.configureTestingModule({
        declarations: [ ChannelComponent ],
        imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      })
      fixture = TestBed.createComponent(ChannelComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it(`should render 'loading' if there's no channel or error yet`, () => {
      component.channel = undefined;
      component.notFound = false;

      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.loading-message')?.textContent).toContain('loading');
      expect(compiled.querySelector('.error-message')?.textContent).toBeUndefined()
    });

    it(`should render 'not found' if notFound is set`, () => {
      component.channel = undefined;
      component.notFound = true;

      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.error-message')?.textContent).toContain('not found');
      expect(compiled.querySelector('.loading-message')?.textContent).toBeUndefined()
    });

    it(`should render various aspects of the channel if there's a channel`, () => {
      component.channel = exampleChannel;

      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;

      expect(compiled.querySelector('.channel-thumbnail')?.src)
        .toContain('path/to/channel/thumbnail.png');
      expect(compiled.querySelector('.channel-name')?.textContent).toContain('Digital Cash Network');
      expect(compiled.querySelector('.channel-handle')?.textContent).toContain('@DigitalCashNetwork');

      expect(compiled.querySelector('.error-message')?.textContent).toBeUndefined()
      expect(compiled.querySelector('.loading-message')?.textContent).toBeUndefined()

      component.tab = component.tabDescription;
      fixture.detectChanges();

      expect(compiled.querySelector('.channel-description')?.textContent).toContain('channel description');
    });
  });

  describe('UI', () => {
    beforeEach(async () => {
      TestBed.configureTestingModule({
        declarations: [ ChannelComponent ],
        imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      })
      fixture = TestBed.createComponent(ChannelComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should set search string to input value', () => {
      component.channel = exampleChannel;
      component.notFound = false;

      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;

      let input = compiled.querySelector('#channel-search-input')
      input.value = 'search text'

      component.doSearch()

      expect(component.searchString).toEqual('search text');
    });

    it('should set search string to small input value', () => {
      component.channel = exampleChannel;
      component.notFound = false;

      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;

      let input = compiled.querySelector('#channel-search-input-small')
      input.value = 'search text'

      component.doSearchSmall()

      expect(component.searchString).toEqual('search text');
    });

  });

  describe('service interaction', () => {
    let getChannelObservable: Observable<Channel>
    beforeEach(async () => {
      class MockLbryService {
        getChannel(mediaUriEncoded: string): Observable<Channel> {
          return getChannelObservable
        }
      }

      TestBed.configureTestingModule({
        providers: [
          ChannelComponent,
          { provide: LbryService, useClass: MockLbryService }
        ],
        imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([
          {path: "@DigitalCashNetwork:c", component: ChannelComponent}
        ])],
      })

      component = TestBed.inject(ChannelComponent);
      lbryService = TestBed.inject(LbryService);
    });

    it('should get channel successfully', (done) => {
      let updateUrlSpy = spyOn(component, 'updateUrl')

      getChannelObservable = new Observable(subscriber => {
        // give the subscriber the channel it wants
        subscriber.next(exampleChannel)

        // now observe the results

        // confirm the state of the component
        expect(component?.channel?.name).toEqual('Digital Cash Network')
        expect(component?.channel?.description).toEqual('channel description')
        expect(component?.channel?.handle).toEqual('@DigitalCashNetwork')
        expect(component?.channel?.thumbnailUrl).toEqual('path/to/channel/thumbnail.png')

        expect(component?.notFound).toBeFalse()

        // confirm that we've redirected to the canonical url
        expect(updateUrlSpy).toHaveBeenCalledWith("@DigitalCashNetwork:c")

        done()
      })

      // actual uri here doesn't matter since we're mocking it
      component.getAndShowChannel('@DigitalCashNetwork:c')
    });

    it('should handle not-found successfully', (done) => {
      let updateUrlSpy = spyOn(component, 'updateUrl')

      getChannelObservable = new Observable(subscriber => {
        // give the subscriber a "not found" error
        subscriber.error({
          type: LbryServiceError.NotFound,
        })

        // now observe the results

        // confirm the state of the component
        expect(component?.channel).toBeUndefined;
        expect(component?.notFound).toBeTrue()

        // confirm that we've redirected to the canonical url
        expect(updateUrlSpy.calls.count()).toEqual(0)

        done()
      })

      // actual uri here doesn't matter since we're mocking it
      component.getAndShowChannel('Dash-Podcast-179:4')
    });
  });
});
