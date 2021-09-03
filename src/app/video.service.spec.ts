import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { VideoService, VideoServiceError } from './video.service';
import { Observable, of } from 'rxjs';

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
        next: x => done.fail("Expected an error response"),
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
        next: x => done.fail("Expected an error response"),
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
        next: x => done.fail("Expected an error response"),
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
        next: x => done.fail("Expected an error response"),
      });
    });
  });

  describe('getStreamUrl', () => {
    it('returns a streamUrl if the response is valid', (done) => {
      httpClientSpy.post.and.returnValue(of({
        result: {
          streaming_url: 'path/to/video.mp4',
        }
      }));

      videoService.getStreamUrl({
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
      }).subscribe({
        next: streamUrl => {
          expect(streamUrl).toEqual('path/to/video.mp4')

          expect(httpClientSpy.post.calls.mostRecent().args.length).toEqual(2)
          expect(httpClientSpy.post.calls.mostRecent().args[1].params.uri).toEqual('lbry://Dash-Podcast-179#4')
          done()
        },
        error: error => done.fail(error)
      });
    });
  });

  describe('getVideos', () => {
    it('returns an array of videos, and page and totalPages, if the response is valid', (done) => {
      httpClientSpy.post.and.returnValue(of({
        result: {
          total_pages: 4,
          page: 4,
          page_size: 20,
          items: [
            {
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
            }, {
              canonical_url: "lbry://@fake-channel#a/fake-video#b",
              short_url: "lbry://fake-video#b",
              signing_channel: {
                name: '@fake-channel',
                value: {
                  title: 'Fake Channel',
                  thumbnail: {
                    url: 'path/to/fake-channel/thumbnail.png',
                  },
                },
              },
              value: {
                title: 'fake video',
                description: 'my fake video description',
                stream_type: 'video',
                thumbnail: {
                  url: 'path/to/fake-video/thumbnail.png',
                },
              },
            }
          ]
        }
      }));

      videoService.getVideos('ordering', 4, 20).subscribe({
        next: ({videos, page, totalPages}) => {
          expect(page).toEqual(4)
          expect(totalPages).toEqual(4)
          expect(videos).toEqual([
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
          ])

          expect(httpClientSpy.post.calls.mostRecent().args.length).toEqual(2)
          expect(httpClientSpy.post.calls.mostRecent().args[1].params.page).toEqual(4)
          expect(httpClientSpy.post.calls.mostRecent().args[1].params.page_size).toEqual(20)
          expect(httpClientSpy.post.calls.mostRecent().args[1].params.order_by).toEqual(['ordering'])
          done()
        },
        error: error => done.fail(error)
      });
    });

    it('returns an error if the API returns an error', (done) => {
      httpClientSpy.post.and.returnValue(new Observable(subscriber => subscriber.error({})))

      videoService.getVideos('ordering', 4, 20).subscribe({
        error: error => {
          expect(error.type).toEqual(VideoServiceError.Unknown)
          done()
        },
        next: x => done.fail("Expected an error response"),
      });
    });
  });
});
