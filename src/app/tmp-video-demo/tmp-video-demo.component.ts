import { Component, OnInit } from "@angular/core";
import { VideoNew } from '../video';
import { VideoService, VideoServiceError } from '../video.service';

@Component({
  selector: 'app-tmp-video-demo',
  templateUrl: './tmp-video-demo.component.html',
  styleUrls: ['./tmp-video-demo.component.css']
})
export class TmpVideoDemoComponent implements OnInit {
  streamUrl: string = "";
  thumbnails: string[] = [];
  streamUrlList: string[] = [];

  constructor(private videoService: VideoService) {
  }
  ngOnInit(): void {
    this.getAndShowMostRecentVideos();
  }

  resolveUriAndSetStreamSrc(mediaUri: string) {
    if (mediaUri) {
      this.videoService.getMediaData(mediaUri)
        .subscribe({
          next: (video) => {
            this.videoService.getStreamUrl(video)
              .subscribe((streamUrl) => {
                this.streamUrl = streamUrl;
                console.log("Stream URL = ", this.streamUrl);
              });
          },
          error: (error) => {
            if (error.type === VideoServiceError.NotFound) {
              // TODO
              alert("404'd!")
            } else if (error.type === VideoServiceError.NotVideo) {
              // TODO
              alert("not a video!")
            } else {
              console.error("There was an error!", error);
            }
          },
        });
    }
  }

  getAndShowMostRecentVideos() {
    this.videoService.getRecentVideos(["tech"])
      .subscribe((vidList) => {
        const shownVidList = vidList.slice(0, 5)
        shownVidList.forEach((video) => {
          this.thumbnails.push(video.thumbnailUrl);
          this.videoService.getStreamUrl(video)
            .subscribe((streamUrl) => {
              this.streamUrlList.push(streamUrl);
              console.log("Stream URL = ", this.streamUrl);
            });
        })
      });
  }

  onSelectVideo(i: number) {
    this.streamUrl = "";
    this.streamUrl = this.streamUrlList[i];
  }
}
