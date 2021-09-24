// TODO - this should be lbry-unauthed.service. there will be a lbry-authed.service
// TODO Note about the API endpoint. Assuming it's protected with the blacklist, add a stern warning that we are depending on the endpoint to do it. So any future endpoint should also make use of it. And also make sure that that blacklist is one that gets updated from LBRY, since obviously videos get blacklisted over time.

import { Injectable } from '@angular/core';
import { Video, VideoPage, Channel } from './models';
import { Observable, of } from 'rxjs';
import { HttpClient } from "@angular/common/http";

export enum LbryServiceError {
  NotFound,
  NotVideo,
  Unknown,
}
const API_NOT_FOUND = 'NOT_FOUND'

// TODO stop making assumptions about what data we're getting in
function buildChannel(apiChannel: any): Channel {
  return {
    handle: apiChannel.name,
    name: apiChannel.value?.title,
    description: apiChannel.value?.description,
    thumbnailUrl: apiChannel.value?.thumbnail?.url,
    canonicalUri: apiChannel.canonical_url.substring(
      apiChannel.canonical_url.indexOf("lbry://") + 'lbry://'.length
    ).replace('#', ':').replace('#', ':'),
  }
}

// TODO stop making assumptions about what data we're getting in
function buildVideo(apiVideo: any): Video {
  let channel : Channel | undefined;
  // Don't acknowledge channels unless there's at least a handle
  // (aka channel.name)
  if (apiVideo.signing_channel?.name) {
    channel = buildChannel(apiVideo.signing_channel)
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

@Injectable({
  providedIn: 'root'
})
export class LbryService {
  APIUrl: string = "https://api.lbry.tv/api/v1/proxy";

  constructor(private http: HttpClient) { }

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
                  type: LbryServiceError.Unknown,
                })
              }
            },
            error: (error) =>
            {
              console.error("getStreamUrl: there was an error! " + video.confirmedUri, error);
              subscriber.error({
                msg: "getStreamUrl: there was an error! " + JSON.stringify(error, null, 2),
                type: LbryServiceError.Unknown,
              });
              return
            },
          })
    })
  }

  getVideos(orderBy: string, searchString: string | undefined, channelUri: string | undefined, page: number, pageSize: number): Observable<VideoPage> {
    return new Observable(subscriber => {
      this.http
        .post<any>(this.APIUrl, {
          method: "claim_search",
          params: {
            not_tags: ["mature", "hentai", "porn", "nsfw"],
            stream_types: ["video"],
            page,
            channel: channelUri,
            page_size: pageSize,
            remove_duplicates: true,
            text: searchString,
            order_by: [orderBy]
          },
        })
          .subscribe({
            next: (data) => {
              const result = data?.result
              if (result?.items && result?.page !== undefined && result?.total_pages !== undefined) {
                subscriber.next({
                  videos: data.result.items.map(buildVideo),
                  page: result.page,
                  totalPages: result.total_pages,
                })
              } else {
                subscriber.error({
                  msg: "getVideos: Missing expected data in response. " + JSON.stringify(result, null, 2),
                  type: LbryServiceError.Unknown,
                })
              }
              subscriber.complete()
            },
            error: (error) => {
              console.error("getVideos: there was an error! ", error);
              subscriber.error({
                msg: "getVideos: there was an error! " + JSON.stringify(error, null, 2),
                type: LbryServiceError.Unknown,
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
                type: LbryServiceError.Unknown,
                msg: "data.error: " + JSON.stringify(data?.error, null, 2),
              })
              return
            }
            if (data?.result?.[mediaUriDecoded] === undefined) {
              console.info("data.result['mediaUriDecoded'] not found: " + mediaUriDecoded)
              subscriber.error({
                msg: "data.result['mediaUriDecoded'] not found",
                type: LbryServiceError.Unknown,
              })
              return
            }

            const result = data.result[mediaUriDecoded];

            if ("error" in result) {
              if (result.error.name === API_NOT_FOUND) {
                console.info(result.error.text);
                subscriber.error({
                  msg: result.error,
                  type: LbryServiceError.NotFound,
                })
              } else {
                console.error("Error when resolving URI! " + mediaUriDecoded, result.error.text);
                subscriber.error({
                  msg: "result.error: " + JSON.stringify(result.error, null, 2),
                  type: LbryServiceError.Unknown,
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
                type: LbryServiceError.NotVideo,
              })
              return
            }

            const video = buildVideo(result)

            subscriber.next(video)
            subscriber.complete()
          },
          error: (error) => {
            console.error("getVideo: there was an error! " + mediaUriDecoded, error);
            subscriber.error({
              msg: "getVideo: there was an error! " + JSON.stringify(error, null, 2),
              type: LbryServiceError.Unknown,
            });
            return
          },
        })
    });
  }

  getChannel(channelUriEncoded: string): Observable<Channel> {
    // We get the channelUri from the brower's URL. It's URLencoded. Turns out
    // the API wants unicode as-is, so we decode it before using it.
    let channelUriDecoded = decodeURI(channelUriEncoded)
    return new Observable(subscriber => {
      this.http
        .post<any>(this.APIUrl, {
          method: "resolve",
          params: { urls: channelUriDecoded },
        })
        .subscribe({
          next: (data) =>
          {
            if (data?.error !== undefined) {
              console.error("error for " + channelUriDecoded, data['error'])
              subscriber.error({
                type: LbryServiceError.Unknown,
                msg: "data.error: " + JSON.stringify(data?.error, null, 2),
              })
              return
            }
            if (data?.result?.[channelUriDecoded] === undefined) {
              console.info("data.result['channelUriDecoded'] not found: " + channelUriDecoded)
              subscriber.error({
                msg: "data.result['channelUriDecoded'] not found",
                type: LbryServiceError.Unknown,
              })
              return
            }

            const result = data.result[channelUriDecoded];

            if ("error" in result) {
              if (result.error.name === API_NOT_FOUND) {
                console.info(result.error.text);
                subscriber.error({
                  msg: result.error,
                  type: LbryServiceError.NotFound,
                })
              } else {
                console.error("Error when resolving URI! " + channelUriDecoded, result.error.text);
                subscriber.error({
                  msg: "result.error: " + JSON.stringify(result.error, null, 2),
                  type: LbryServiceError.Unknown,
                })
              }
              return
            }

            const channel = buildChannel(result)

            subscriber.next(channel)
            subscriber.complete()
          },
          error: (error) => {
            console.error("getChannel: there was an error! " + channelUriDecoded, error);
            subscriber.error({
              msg: "getChannel: there was an error! " + JSON.stringify(error, null, 2),
              type: LbryServiceError.Unknown,
            });
            return
          },
        })
    });
  }
}
