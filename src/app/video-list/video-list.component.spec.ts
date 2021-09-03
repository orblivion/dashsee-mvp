import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { VideoListComponent } from './video-list.component';
import { VideoService, VideoServiceError, VideoPage } from '../video.service';
import { Video } from '../video';

import { Observable } from 'rxjs';

const exampleVideos = [
  {
    title: "my title",
    thumbnailUrl: "path/to/video/thumbnail.png",
    description: "my description",
    confirmedUri: "lbry://Dash-Podcast-179#4",
    channel: {
      handle: "@DigitalCashNetwork",
      name: "Digital Cash Network",
      thumbnailUrl: "path/to/channel/thumbnail.png",
    },
    canonicalUri: "@DigitalCashNetwork:c/Dash-Podcast-179:4",
  }, {
    title: "fake video",
    thumbnailUrl: "path/to/fake-video/thumbnail.png",
    description: "my fake video description",
    confirmedUri: "lbry://fake-video#b",
    channel: {
      handle: "@fake-channel",
      name: "Fake Channel",
      thumbnailUrl: "path/to/fake-channel/thumbnail.png",
    },
    canonicalUri: "@fake-channel:a/fake-video:b",
  },
]

describe('VideoListComponent', () => {
  let component: VideoListComponent;
  let videoService: VideoService;
  let fixture: ComponentFixture<VideoListComponent>;

  describe('display', () => {
    beforeEach(async () => {
      TestBed.configureTestingModule({
        declarations: [ VideoListComponent ],
        imports: [HttpClientTestingModule],
      })
      fixture = TestBed.createComponent(VideoListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it(`should render 'loading' in the search result area if there are no videos or error yet`, () => {
      component.loading = true;

      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.loading-message')).toBeTruthy();
    });

    it(`should list videos in the search result area if there are videos`, () => {
      component.videos = exampleVideos;
      component.totalPages = 2;
      component.currentPage = 1;
      component.loading = false;

      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;

      expect(compiled.querySelector('.loading-message')).toBeNull();
      expect(compiled.querySelector('.error-message')).toBeNull();

      expect(compiled.querySelector('.video-list-item:nth-of-type(1) .video-title')?.textContent).toContain('my title');
      expect(compiled.querySelector('.video-list-item:nth-of-type(1) .channel-thumbnail')?.src)
        .toContain('path/to/channel/thumbnail.png');
      expect(compiled.querySelector('.video-list-item:nth-of-type(1) .video-thumbnail')?.src)
        .toContain('path/to/video/thumbnail.png');
      expect(compiled.querySelector('.video-list-item:nth-of-type(1) .channel-name')?.textContent).toContain('Digital Cash Network');
      expect(compiled.querySelector('.video-list-item:nth-of-type(1) .channel-handle')?.textContent).toContain('@DigitalCashNetwork');

      expect(compiled.querySelector('.video-list-item:nth-of-type(2) .video-title')?.textContent).toContain('fake video');
      expect(compiled.querySelector('.video-list-item:nth-of-type(2) .channel-thumbnail')?.src)
        .toContain('path/to/fake-channel/thumbnail.png');
      expect(compiled.querySelector('.video-list-item:nth-of-type(2) .video-thumbnail')?.src)
        .toContain('path/to/fake-video/thumbnail.png');
      expect(compiled.querySelector('.video-list-item:nth-of-type(2) .channel-name')?.textContent).toContain('Fake Channel');
      expect(compiled.querySelector('.video-list-item:nth-of-type(2) .channel-handle')?.textContent).toContain('@fake-channel');
    });

    it(`should show the "show more" button if there are more videos`, () => {
      component.videos = exampleVideos;
      component.totalPages = 2;
      component.currentPage = 1;
      component.loading = false;

      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;

      expect(compiled.querySelector('.btn-next-page')).toBeTruthy();
    });

    it(`should not show the "show more" button if there are no more videos`, () => {
      component.videos = exampleVideos;
      component.totalPages = 2;
      component.currentPage = 2;

      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;

      expect(compiled.querySelector('.btn-next-page')).toBeNull();
    });

    it(`should render 'something went wrong' in the search result area, and not the "show more" button, if there is an error`, () => {
      component.requestError = true
      component.totalPages = 2;
      component.currentPage = 1;

      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.error-message')).toBeTruthy();
      expect(compiled.querySelector('.btn-next-page')).toBeNull();
    });
  });

  describe('service interaction', () => {
    let getVideosResponse: Observable<VideoPage>;
    let getVideosCalledWithPage: number;
    let getVideosCalledWithOrderBy: string;

    beforeEach(async () => {
      class MockVideoService {
        getVideos(orderBy : string, page : number, pageSize : number): Observable<VideoPage> {
          getVideosCalledWithPage = page
          getVideosCalledWithOrderBy = orderBy
          return getVideosResponse;
        }
      }

      TestBed.configureTestingModule({
        providers: [
          VideoListComponent,
          { provide: VideoService, useClass: MockVideoService }
        ],
        imports: [HttpClientTestingModule],
      })

      component = TestBed.inject(VideoListComponent);
      videoService = TestBed.inject(VideoService);
    });

    it('should get videos and page details successfully', (done) => {
      getVideosResponse = new Observable(subscriber => {
        // give the subscriber the videos it wants
        subscriber.next({
          videos: exampleVideos, page: 4, totalPages: 5
        })

        // now observe the results

        // confirm the state of the component
        expect(component?.currentPage).toEqual(4)
        expect(component?.totalPages).toEqual(5)

        // Make sure it appends to existing videos in list
        expect(component?.videos.length).toEqual(3);
        expect(component?.videos[0].title).toEqual("existing video")
        expect(component?.videos[1].title).toEqual("my title")
        expect(component?.videos[2].title).toEqual("fake video")
        expect(component?.requestError).toBeFalse()

        // "loading" should be true before the response comes back,
        // but the mock is too fast to test
        expect(component.loading).toBeFalse()

        expect(getVideosCalledWithPage).toEqual(4)
        expect(getVideosCalledWithOrderBy).toEqual('ordering')

        done()
      })

      component.totalPages = undefined;
      component.currentPage = 3;
      component.orderBy = 'ordering';
      component.videos = [{
        title: "existing video",
        thumbnailUrl: "path/to/existing-video/thumbnail.png",
        description: "my existing video description",
        confirmedUri: "lbry://existing-video#b",
        channel: {
          handle: "@fake-channel",
          name: "Fake Channel",
          thumbnailUrl: "path/to/existing-channel/thumbnail.png",
        },
        canonicalUri: "@fake-channel:a/existing-video:b",
      }];
      component.getAndShowNextVideos()
    });

    it('should handle error response successfully', (done) => {
      getVideosResponse = new Observable(subscriber => {
        // give the subscriber an error
        subscriber.error({
          type: VideoServiceError.Unknown,
        })

        // now observe the results

        // confirm the state of the component
        expect(component?.videos.length).toEqual(0);
        expect(component?.requestError).toBeTrue()

        done()
      })

      component.orderBy = 'ordering';
      component.getAndShowNextVideos()
    });
  });
});
