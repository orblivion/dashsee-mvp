import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { VideoComponent } from './video.component';

const exampleVideo = {
  title: "my title",
  thumbnailUrl: "path/to/video/thumbnail.png",
  description: "my description",
  confirmedUri: "for#video",
  channel: {
    handle: "@mychannel",
    name: "my channel",
    thumbnailUrl: "path/to/channel/thumbnail.png",
  },
  canonicalUri: "@full#uri/for#video",
}

describe('VideoComponent', () => {
  let component: VideoComponent;
  let fixture: ComponentFixture<VideoComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ VideoComponent ],
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
    })
    fixture = TestBed.createComponent(VideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('display', () => {
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
      expect(compiled.querySelector('.channel-name')?.textContent).toContain('my channel');
      expect(compiled.querySelector('.channel-handle')?.textContent).toContain('@mychannel');
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
    beforeEach(async () => {
      class MockVideoService {
      }
    })
  });
});
