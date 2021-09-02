import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { VideoService } from './video.service';
import { of } from 'rxjs';

describe('VideoService', () => {
  let videoService: VideoService;
  let httpClientSpy: { post: jasmine.Spy };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    videoService = new VideoService(httpClientSpy as any)
  });

  it('getVideo returns a video if the response is valid', (done) => {
    httpClientSpy.post.and.returnValue(of({
      'result': {
        'Dash-Podcast-179': {
          canonical_url: "lbry://@DigitalCashNetwork#c/Dash-Podcast-179#4",
          short_url: "lbry://Dash-Podcast-179#4",
          signing_channel: {
            name: '@DigitalCashNetwork',
            value: {
              title: 'Digital Cash Network',
              thumbnail: {
                url: 'path/to/channel/thumbnail.png',
              },
            },
          },
          value: {
            title: 'my title',
            description: 'my description',
            stream_type: 'video',
            thumbnail: {
              url: 'path/to/video/thumbnail.png',
            },
          },
        }
      }
    }));

    videoService.getVideo('Dash-Podcast-179').subscribe({
      next: video => {
        expect(video).toEqual({
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
        })
        expect(httpClientSpy.post.calls.mostRecent().args.length).toEqual(2)
        expect(httpClientSpy.post.calls.mostRecent().args[1].params.urls).toEqual('Dash-Podcast-179')
        done()
      },
      error: error => done.fail(error)
    });
  });
});
