import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { VideoComponent } from './video.component';
import { VideoService, VideoServiceError } from '../video.service';
import { Video } from '../video';

import { Observable, of } from 'rxjs';

const exampleVideo = {
  title: "my title",
  thumbnailUrl: "path/to/video/thumbnail.png",
  description: "my description",
  confirmedUri: "Dash-Podcast-179:4",
  channel: {
    handle: "@DigitalCashNetwork",
    name: "Digital Cash Network",
    thumbnailUrl: "path/to/channel/thumbnail.png",
  },
  canonicalUri: "@DigitalCashNetwork:c/Dash-Podcast-179:4",
}

describe('VideoComponent', () => {
  let component: VideoComponent;
  let videoService: VideoService;
  let fixture: ComponentFixture<VideoComponent>;

  describe('display', () => {
    beforeEach(async () => {
      TestBed.configureTestingModule({
        declarations: [ VideoComponent ],
        imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      })
      fixture = TestBed.createComponent(VideoComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it(`should render 'loading' in the video frame if there's no video or error yet`, () => {

      component.video = undefined;
      component.notFound = false;
      component.notVideo = false;

      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.video-container')?.textContent).toContain('loading');
    });

    it(`should render 'not found' in the video frame if notFound is set`, () => {

      component.video = undefined;
      component.notFound = true;
      component.notVideo = false;

      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.video-container')?.textContent).toContain('not found');
    });

    it(`should render 'not a video' in the video frame if notVideo is set`, () => {

      component.video = undefined;
      component.notFound = false;
      component.notVideo = true;

      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.video-container')?.textContent).toContain('not a video');
    });

    it(`should render various aspects of the video if there's a video`, () => {

      component.video = exampleVideo;

      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.video-title')?.textContent).toContain('my title');
      expect(compiled.querySelector('.video-description')?.textContent).toContain('my description');
      expect(compiled.querySelector('img.channel-thumbnail')?.src)
        .toContain('path/to/channel/thumbnail.png');
      expect(compiled.querySelector('img.channel-thumbnail')?.src)
        .toContain('path/to/channel/thumbnail.png');
      expect(compiled.querySelector('.channel-name')?.textContent).toContain('Digital Cash Network');
      expect(compiled.querySelector('.channel-handle')?.textContent).toContain('@DigitalCashNetwork');
    });
    it(`should render video src and no thumbnail if there is a stream Url`, () => {

      component.video = exampleVideo;
      component.streamUrl = 'path/to/video.mp4';

      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('video.video-frame')?.src)
        .toContain('path/to/video.mp4');
      expect(compiled.querySelector('img.video-frame')).toBeNull()
    });
    it(`should render thumbnail src and no video if there is no stream Url`, () => {

      component.video = exampleVideo;
      component.streamUrl = undefined;

      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('img.video-frame')?.src)
        .toContain('path/to/video/thumbnail.png');
      expect(compiled.querySelector('video.video-frame')).toBeNull()
    });
  });


  describe('service interaction', () => {
    let getVideoObservable: Observable<Video>
    let getStreamUrlObservable: Observable<any>
    beforeEach(async () => {
      class MockVideoService {
        getStreamUrl(video: Video): Observable<any> {
          return getStreamUrlObservable
        }
        getVideo(mediaUriEncoded: string): Observable<Video> {
          return getVideoObservable
        }
      }

      TestBed.configureTestingModule({
        providers: [
          VideoComponent,
          { provide: VideoService, useClass: MockVideoService }
        ],
        imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([
          {path: "@DigitalCashNetwork:c/Dash-Podcast-179:4", component: VideoComponent}
        ])],
      })

      component = TestBed.inject(VideoComponent);
      videoService = TestBed.inject(VideoService);
    });

    it('should get video successfully', (done) => {
      let updateUrlSpy = spyOn(component, 'updateUrl')

      getVideoObservable = new Observable(subscriber => {
          // give the subscriber the video it wants
          subscriber.next(exampleVideo)

          // now observe the results

          // confirm the state of the component
          expect(component?.video?.title).toEqual("my title")
          expect(component?.streamUrl).toEqual('path/to/video.mp4')
          expect(component?.notFound).toBeFalse()
          expect(component?.notVideo).toBeFalse()

          // confirm that we've redirected to the canonical url
          expect(updateUrlSpy).toHaveBeenCalledWith("@DigitalCashNetwork:c/Dash-Podcast-179:4")

          done()
      })
      getStreamUrlObservable = of('path/to/video.mp4')

      // actual uri here doesn't matter since we're mocking it
      component.getAndShowVideo('Dash-Podcast-179:4')
    });

    it('should handle not-found successfully', (done) => {
      let updateUrlSpy = spyOn(component, 'updateUrl')

      getVideoObservable = new Observable(subscriber => {
          // give the subscriber a "not found" error
          subscriber.error({
            type: VideoServiceError.NotFound,
          })

          // now observe the results

          // confirm the state of the component
          expect(component?.video).toBeUndefined;
          expect(component?.streamUrl).toBeUndefined;
          expect(component?.notFound).toBeTrue()
          expect(component?.notVideo).toBeFalse()

          // confirm that we've redirected to the canonical url
          expect(updateUrlSpy.calls.count()).toEqual(0)

          done()
      })
      getStreamUrlObservable = of('path/to/video.mp4')

      // actual uri here doesn't matter since we're mocking it
      component.getAndShowVideo('Dash-Podcast-179:4')
    });

    it('should handle not-video successfully', (done) => {
      let updateUrlSpy = spyOn(component, 'updateUrl')

      getVideoObservable = new Observable(subscriber => {
          // give the subscriber a "not found" error
          subscriber.error({
            type: VideoServiceError.NotVideo,
          })

          // now observe the results

          // confirm the state of the component
          expect(component?.video).toBeUndefined;
          expect(component?.streamUrl).toBeUndefined;
          expect(component?.notFound).toBeFalse()
          expect(component?.notVideo).toBeTrue()

          // confirm that we've redirected to the canonical url
          expect(updateUrlSpy.calls.count()).toEqual(0)

          done()
      })
      getStreamUrlObservable = of('path/to/video.mp4')

      // actual uri here doesn't matter since we're mocking it
      component.getAndShowVideo('Dash-Podcast-179:4')
    });

  });
});
