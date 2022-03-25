import { Injectable } from '@angular/core';
import { Video, Channel } from './video'; // TODO different file name?
import { Observable, of } from 'rxjs';
import { HttpClient } from "@angular/common/http";

export enum VideoServiceError {
  NotFound,
  NotVideo,
  Unknown,
}
const API_NOT_FOUND = 'NOT_FOUND'

export interface VideoPage{
  videos: Video[];
  page: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  APIUrl: string = "https://api.lbry.tv/api/v1/proxy";

  constructor(private http: HttpClient) { }

  // TODO - what is a "confirmed" uri? just want to name/comment things properly

  // Given a video object of our defined structure, get the stream URL for the video
  getStreamUrl(video: Video): Observable<any> {
    return new Observable(subscriber => {
      this.http
        .post<any>(this.APIUrl, {
          method: "get",
          params: {
            uri: video.confirmedUri,
            save_file: false,
          },
        })
          .subscribe({
            next: (data) =>
            {
              if (data?.result?.streaming_url) {
                subscriber.next(data?.result?.streaming_url)
                subscriber.complete()
              } else {
                console.error("missing streaming_url for " + video.confirmedUri)
                subscriber.error({
                  msg: "missing streaming_url for " + video.confirmedUri,
                  type: VideoServiceError.Unknown,
                })
              }
            },
            error: (error) =>
            {
              console.error("getStreamUrl: there was an error! " + video.confirmedUri, error);
              subscriber.error({
                msg: "getStreamUrl: there was an error! " + JSON.stringify(error, null, 2),
                type: VideoServiceError.Unknown,
              });
              return
            },
          })
    })
  }

  // Given a video object that came from the API, construct a video object using our
  // own defined structure. This includes creating a channel sub-structure.
  //
  // TODO stop making assumptions about what data we're getting in
  private buildVideo(apiVideo: any): Video {
    let channel : Channel | undefined;
    // Don't acknowledge channels unless there's at least a handle
    // (aka channel.name)
    if (apiVideo.signing_channel?.name) {
      channel = {
        handle: apiVideo.signing_channel.name,
        name: apiVideo.signing_channel.value?.title,
        thumbnailUrl: apiVideo.signing_channel.value?.thumbnail?.url,
      }
    }
    return {
      channel,

      title: apiVideo.value.title,
      description: apiVideo?.value?.description,
      thumbnailUrl: apiVideo.value.thumbnail.url,

      canonicalUri: apiVideo.canonical_url.substring(
        apiVideo.canonical_url.indexOf("lbry://") + 'lbry://'.length
      ).replace('#', ':').replace('#', ':'),

      confirmedUri: apiVideo.short_url.substring(
        apiVideo.short_url.indexOf("lbry://")
      ),
    }
  }

  // Get a paginated list of video from the API
  getVideos(orderBy: string, page: number, pageSize: number): Observable<VideoPage> {
    return new Observable(subscriber => {
      this.http
        .post<any>(this.APIUrl, {
          method: "claim_search",
          params: {
            not_tags: ["mature", "hentai", "porn", "nsfw"],
            stream_types: ["video"],
            page,
            page_size: pageSize,
            remove_duplicates: true,
            order_by: [orderBy]
          },
        })
          .subscribe({
            next: (data) => {
              const result = data?.result
              if (result?.items && result?.page !== undefined && result?.total_pages !== undefined) {
                subscriber.next({
                  videos: data.result.items.map(this.buildVideo),
                  page: result.page,
                  totalPages: result.total_pages,
                })
              } else {
                subscriber.error({
                  msg: "getVideos: Missing expected data in response. " + JSON.stringify(result, null, 2),
                  type: VideoServiceError.Unknown,
                })
              }
              subscriber.complete()
            },
            error: (error) => {
              console.error("getVideos: there was an error! ", error);
              subscriber.error({
                msg: "getVideos: there was an error! " + JSON.stringify(error, null, 2),
                type: VideoServiceError.Unknown,
              });
              return
            },
          })
    })
  }

  getVideo(mediaUriEncoded: string): Observable<Video> {
    // We get the mediaUri from the brower's URL. It's URLencoded. Turns out
    // the API wants unicode as-is, so we decode it before using it.
    let mediaUriDecoded = decodeURI(mediaUriEncoded)
    return new Observable(subscriber => {
      this.http
        .post<any>(this.APIUrl, {
          method: "resolve",
          params: { urls: mediaUriDecoded },
        })
        .subscribe({
          next: (data) =>
          {
            if (data?.error !== undefined) {
              console.error("error for " + mediaUriDecoded, data['error'])
              subscriber.error({
                type: VideoServiceError.Unknown,
                msg: "data.error: " + JSON.stringify(data?.error, null, 2),
              })
              return
            }
            if (data?.result?.[mediaUriDecoded] === undefined) {
              console.info("data.result['mediaUriDecoded'] not found: " + mediaUriDecoded)
              subscriber.error({
                msg: "data.result['mediaUriDecoded'] not found",
                type: VideoServiceError.Unknown,
              })
              return
            }

            const result = data.result[mediaUriDecoded];

            if ("error" in result) {
              if (result.error.name === API_NOT_FOUND) {
                console.info(result.error.text);
                subscriber.error({
                  msg: result.error,
                  type: VideoServiceError.NotFound,
                })
              } else {
                console.error("Error when resolving URI! " + mediaUriDecoded, result.error.text);
                subscriber.error({
                  msg: "result.error: " + JSON.stringify(result.error, null, 2),
                  type: VideoServiceError.Unknown,
                })
              }
              return
            }
            if (result?.value?.stream_type != "video") {
              console.info(
                "URI don't resolve to a video! " + mediaUriDecoded,
                result?.value?.stream_type
              );
              subscriber.error({
                msg: "URI don't resolve to a video!" + result?.value?.stream_type,
                type: VideoServiceError.NotVideo,
              })
              return
            }

            const video = this.buildVideo(result)

            subscriber.next(video)
            subscriber.complete()
          },
          error: (error) => {
            console.error("getVideo: there was an error! " + mediaUriDecoded, error);
            subscriber.error({
              msg: "getVideo: there was an error! " + JSON.stringify(error, null, 2),
              type: VideoServiceError.Unknown,
            });
            return
          },
        })
    });
  }

}
