import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { VideoService, VideoServiceError } from './video.service';
import { of } from 'rxjs';

describe('VideoService', () => {
  let videoService: VideoService;
  let httpClientSpy: { post: jasmine.Spy };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    videoService = new VideoService(httpClientSpy as any)
  });

  describe('getVideo', () => {
    it('returns a video if the response is valid', (done) => {
      httpClientSpy.post.and.returnValue(of({
        result: {
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

    it('decodes the uri before passing it to the API', (done) => {
      httpClientSpy.post.and.returnValue(of({}));

      videoService.getVideo('%F0%9F%94%B4').subscribe({
        // using the error case just because I didn't want to have a dummy API response
        error: error => {
          expect(httpClientSpy.post.calls.mostRecent().args.length).toEqual(2)
          expect(httpClientSpy.post.calls.mostRecent().args[1].params.urls).not.toEqual('%F0%9F%94%B4')
          expect(encodeURI(httpClientSpy.post.calls.mostRecent().args[1].params.urls)).toEqual('%F0%9F%94%B4')
          done()
        },
        next: x => done.fail
      });
    });

    it('returns a "not found" if there is not the expected video in the response', (done) => {
      httpClientSpy.post.and.returnValue(of({
        result: {
          'Dash-Podcast-179': {
            error: {
              name: 'NOT_FOUND',
            }
          },
        }
      }));

      videoService.getVideo('Dash-Podcast-179').subscribe({
        error: error => {
          expect(error.type).toEqual(VideoServiceError.NotFound)
          done()
        },
        next: x => done.fail
      });
    });

    it('returns a "not video" if the steram is not a video', (done) => {
      httpClientSpy.post.and.returnValue(of({
        result: {
          'Dash-Podcast-179': {
            value: {
              stream_type: 'audio',
            },
          },
        }
      }));

      videoService.getVideo('Dash-Podcast-179').subscribe({
        error: error => {
          expect(error.type).toEqual(VideoServiceError.NotVideo)
          done()
        },
        next: x => done.fail
      });
    });

    it('returns an unknown error for errors other than "not found"', (done) => {
      httpClientSpy.post.and.returnValue(of({
        result: {
          'Dash-Podcast-179': {
            error: {
              name: 'SOMETHING_ELSE',
            }
          },
        }
      }));

      videoService.getVideo('Dash-Podcast-179').subscribe({
        error: error => {
          expect(error.type).toEqual(VideoServiceError.Unknown)
          done()
        },
        next: x => done.fail
      });
    });
  });
});
