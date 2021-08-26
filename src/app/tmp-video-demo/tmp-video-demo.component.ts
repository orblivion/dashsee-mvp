import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-tmp-video-demo',
  templateUrl: './tmp-video-demo.component.html',
  styleUrls: ['./tmp-video-demo.component.css']
})
export class TmpVideoDemoComponent implements OnInit {
  baseURL: string = "https://api.lbry.tv/api/v1/proxy";
  streamUrl: string = "";
  thumbnails: string[] = [];
  streamUrlList: string[] = [];

  constructor(private http: HttpClient) {
  }
  ngOnInit(): void {
    this.getAndShowMostRecentVideos();
  }

  resolveUriAndSetStreamSrc(uri: string) {
    if (uri) {
      this.http
        .post<any>(this.baseURL, {
          method: "resolve",
          params: { urls: uri },
        })
        .subscribe({
          next: (data) => {
            if (uri in data.result) {
              const result = data.result[uri];
              if ("error" in result) {
                console.error("Error when resolving URI!", result.error.text);
              } else if (result?.value?.stream_type != "video") {
                console.error(
                  "URI don't resolve to a video!",
                  result?.value?.stream_type
                );
              } else {
                const confirmedUri: string = result.short_url.substring(
                  result.short_url.indexOf("lbry://")
                );
                this.http
                  .post<any>(this.baseURL, {
                    method: "get",
                    params: {
                      uri: confirmedUri,
                      save_file: false,
                    },
                  })
                  .subscribe((data) => {
                    this.streamUrl = data?.result?.streaming_url;
                    console.log("Stream URL = ", this.streamUrl);
                  });
              }
            }
          },
          error: (error) => {
            console.error("There was an error!", error);
          },
        });
    }
  }

  getAndShowMostRecentVideos() {
    this.http
      .post<any>(this.baseURL, {
        method: "claim_search",
        params: { stream_types: ["video"], any_tags: "tech" },
      })
      .subscribe((data) => {
        if (data?.result?.items) {
          const vidList: any[] = data?.result?.items;
          if (vidList.length > 0) {
            const maxLen = vidList.length > 5 ? 5 : vidList.length;
            for (let i = 0; i < maxLen; i++) {
              this.thumbnails.push(vidList[i]?.value?.thumbnail?.url);
              const uri: string = vidList[i].short_url.substring(
                vidList[i].short_url.indexOf("lbry://")
              );
              this.http
                .post<any>(this.baseURL, {
                  method: "get",
                  params: {
                    uri: uri,
                    save_file: false,
                  },
                })
                .subscribe((data) => {
                  this.streamUrlList.push(data?.result?.streaming_url);
                });
            }
          }
        }
        console.log("Stream URL = ", this.streamUrl);
      });
  }

  onSelectVideo(i: number) {
    this.streamUrl = "";
    this.streamUrl = this.streamUrlList[i];
  }
}
