import { Injectable } from '@angular/core';
import { Video } from './video';
import { Observable, of } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { StatusService } from './status.service';

export enum VideoServiceError {
  NotFound,
  NotVideo,
  Unknown,
}
const API_NOT_FOUND = 'NOT_FOUND'

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  APIUrl: string = "https://api.lbry.tv/api/v1/proxy";

  constructor(private statusService : StatusService, private http: HttpClient) { }

  // TODO - what is a "confirmed" uri? just want to name/comment things properly
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
              console.error("There was an error! " + video.confirmedUri, error);
              subscriber.error({
                msg: "There was an error! " + JSON.stringify(error, null, 2),
                type: VideoServiceError.Unknown,
              });
              return
            },
          })
    })
  }

  private buildVideo(apiVideo: any): Video {
    return {
      channelName: apiVideo.signing_channel?.name,

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

  getRecentVideos(tags: string[]): Observable<Video[]> {
    return new Observable(subscriber => {
      this.http
        .post<any>(this.APIUrl, {
          method: "claim_search",
          params: { stream_types: ["video"], any_tags: tags },
        })
          .subscribe((data) => {
            if (data?.result?.items) {
              const vidList = data.result.items.map(this.buildVideo)
              subscriber.next(vidList)
            } else {
              subscriber.next([])
            }
            subscriber.complete()
          })
      })
  }

  getVideo(mediaUri: string): Observable<Video> {
    return new Observable(subscriber => {
      this.http
        .post<any>(this.APIUrl, {
          method: "resolve",
          params: { urls: mediaUri },
        })
        .subscribe({
          next: (data) =>
          {
            if (data?.error !== undefined) {
              console.error("error for " + mediaUri, data['error'])
              subscriber.error({
                type: VideoServiceError.Unknown,
                msg: "data.error: " + JSON.stringify(data?.error, null, 2),
              })
              return
            }
            if (data?.result?.[mediaUri] === undefined) {
              console.info("data.result['mediaUri'] not found: " + mediaUri)
              subscriber.error({
                msg: "data.result['mediaUri'] not found",
                type: VideoServiceError.Unknown,
              })
              return
            }

            const result = data.result[mediaUri];

            if ("error" in result) {
              if (result.error.name === API_NOT_FOUND) {
                console.info(result.error.text);
                subscriber.error({
                  msg: result.error,
                  type: VideoServiceError.NotFound,
                })
              } else {
                console.error("Error when resolving URI! " + mediaUri, result.error.text);
                subscriber.error({
                  msg: "result.error" + JSON.stringify(result.error, null, 2),
                  type: VideoServiceError.Unknown,
                })
              }
              return
            }
            if (result?.value?.stream_type != "video") {
              console.info(
                "URI don't resolve to a video! " + mediaUri,
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
            console.error("There was an error! " + mediaUri, error);
            subscriber.error({
              msg: "There was an error! " + JSON.stringify(error, null, 2),
              type: VideoServiceError.Unknown,
            });
            return
          },
        })
    });
  }

}
