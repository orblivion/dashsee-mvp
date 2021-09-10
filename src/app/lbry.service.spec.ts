import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LbryService, LbryServiceError } from './lbry.service';
import { Observable, of } from 'rxjs';

describe('LbryService', () => {
  let lbryService: LbryService;
  let httpClientSpy: { post: jasmine.Spy };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    lbryService = new LbryService(httpClientSpy as any)
  });

  describe('getVideo', () => {
    it('returns a video if the response is valid', (done) => {
      httpClientSpy.post.and.returnValue(of({
        result: {
          'Dash-Podcast-179': {
            canonical_url: "lbry://@DigitalCashNetwork#c/Dash-Podcast-179#4",
            short_url: "lbry://Dash-Podcast-179#4",
            signing_channel: {
              canonical_url: "lbry://@DigitalCashNetwork#c",
              name: '@DigitalCashNetwork',
              value: {
                title: 'Digital Cash Network',
                description: 'channel description',
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

      lbryService.getVideo('Dash-Podcast-179').subscribe({
        next: video => {
          expect(video).toEqual({
            title: "my title",
            thumbnailUrl: "path/to/video/thumbnail.png",
            description: "my description",
            confirmedUri: "lbry://Dash-Podcast-179#4",
            channel: {
              handle: "@DigitalCashNetwork",
              name: "Digital Cash Network",
              description: "channel description",
              thumbnailUrl: "path/to/channel/thumbnail.png",
              canonicalUri: "@DigitalCashNetwork:c",
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

      lbryService.getVideo('%F0%9F%94%B4').subscribe({
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

      lbryService.getVideo('Dash-Podcast-179').subscribe({
        error: error => {
          expect(error.type).toEqual(LbryServiceError.NotFound)
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

      lbryService.getVideo('Dash-Podcast-179').subscribe({
        error: error => {
          expect(error.type).toEqual(LbryServiceError.NotVideo)
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

      lbryService.getVideo('Dash-Podcast-179').subscribe({
        error: error => {
          expect(error.type).toEqual(LbryServiceError.Unknown)
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

      lbryService.getStreamUrl({
        title: "my title",
        thumbnailUrl: "path/to/video/thumbnail.png",
        description: "my description",
        confirmedUri: "lbry://Dash-Podcast-179#4",
        channel: {
          handle: "@DigitalCashNetwork",
          name: "Digital Cash Network",
          description: "channel description",
          thumbnailUrl: "path/to/channel/thumbnail.png",
          canonicalUri: "@DigitalCashNetwork:c",
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
                canonical_url: "lbry://@DigitalCashNetwork#c",
                name: '@DigitalCashNetwork',
                value: {
                  title: 'Digital Cash Network',
                  description: "channel description",
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
                canonical_url: "lbry://@fake-channel#a",
                name: '@fake-channel',
                value: {
                  title: 'Fake Channel',
                  description: "fake description",
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

      lbryService.getVideos('ordering', 'text search', 'channel', 4, 20).subscribe({
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
                description: "channel description",
                thumbnailUrl: "path/to/channel/thumbnail.png",
                canonicalUri: "@DigitalCashNetwork:c",
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
                description: "fake description",
                thumbnailUrl: "path/to/fake-channel/thumbnail.png",
                canonicalUri: "@fake-channel:a",
              },
              canonicalUri: "@fake-channel:a/fake-video:b",
            },
          ])

          expect(httpClientSpy.post.calls.mostRecent().args.length).toEqual(2)
          expect(httpClientSpy.post.calls.mostRecent().args[1].params.page).toEqual(4)
          expect(httpClientSpy.post.calls.mostRecent().args[1].params.page_size).toEqual(20)
          expect(httpClientSpy.post.calls.mostRecent().args[1].params.order_by).toEqual(['ordering'])
          expect(httpClientSpy.post.calls.mostRecent().args[1].params.text).toEqual('text search')
          expect(httpClientSpy.post.calls.mostRecent().args[1].params.channel).toEqual('channel')
          done()
        },
        error: error => done.fail(error)
      });
    });

    it('returns an error if the API returns an error', (done) => {
      httpClientSpy.post.and.returnValue(new Observable(subscriber => subscriber.error({})))

      lbryService.getVideos('ordering', 'text search', 'channel', 4, 20).subscribe({
        error: error => {
          expect(error.type).toEqual(LbryServiceError.Unknown)
          done()
        },
        next: x => done.fail("Expected an error response"),
      });
    });
  });

  describe('getChannel', () => {
    it('returns a channel if the response is valid', (done) => {
      httpClientSpy.post.and.returnValue(of({
        result: {
          '@DigitalCashNetwork': {
            canonical_url: "lbry://@DigitalCashNetwork#c",
            short_url: "lbry://@DigitalCashNetwork#c",
            name: '@DigitalCashNetwork',
            value: {
              title: 'Digital Cash Network',
              description: 'channel description',
              thumbnail: {
                url: 'path/to/channel/thumbnail.png',
              },
            },
          }
        }
      }));

      lbryService.getChannel('@DigitalCashNetwork').subscribe({
        next: channel => {
          expect(channel).toEqual({
            handle: "@DigitalCashNetwork",
            name: "Digital Cash Network",
            description: "channel description",
            thumbnailUrl: "path/to/channel/thumbnail.png",
            canonicalUri: "@DigitalCashNetwork:c",
          })
          expect(httpClientSpy.post.calls.mostRecent().args.length).toEqual(2)
          expect(httpClientSpy.post.calls.mostRecent().args[1].params.urls).toEqual('@DigitalCashNetwork')
          done()
        },
        error: error => done.fail(error)
      });
    });

    it('decodes the uri before passing it to the API', (done) => {
      httpClientSpy.post.and.returnValue(of({}));

      lbryService.getChannel('@%F0%9F%94%B4').subscribe({
        // using the error case just because I didn't want to have a dummy API response
        error: error => {
          expect(httpClientSpy.post.calls.mostRecent().args.length).toEqual(2)
          expect(httpClientSpy.post.calls.mostRecent().args[1].params.urls).not.toEqual('@%F0%9F%94%B4')
          expect(encodeURI(httpClientSpy.post.calls.mostRecent().args[1].params.urls)).toEqual('@%F0%9F%94%B4')
          done()
        },
        next: x => done.fail("Expected an error response"),
      });
    });

    it('returns a "not found" if there is not the expected channel in the response', (done) => {
      httpClientSpy.post.and.returnValue(of({
        result: {
          '@DigitalCashNetwork': {
            error: {
              name: 'NOT_FOUND',
            }
          },
        }
      }));

      lbryService.getChannel('@DigitalCashNetwork').subscribe({
        error: error => {
          expect(error.type).toEqual(LbryServiceError.NotFound)
          done()
        },
        next: x => done.fail("Expected an error response"),
      });
    });

    it('returns an unknown error for errors other than "not found"', (done) => {
      httpClientSpy.post.and.returnValue(of({
        result: {
          '@DigitalCashNetwork': {
            error: {
              name: 'SOMETHING_ELSE',
            }
          },
        }
      }));

      lbryService.getChannel('@DigitalCashNetwork').subscribe({
        error: error => {
          expect(error.type).toEqual(LbryServiceError.Unknown)
          done()
        },
        next: x => done.fail("Expected an error response"),
      });
    });
  });

});
